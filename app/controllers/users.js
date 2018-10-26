
const express = require('express');
const passport = require('passport');
const models = require('../models');
const crypto = require('../../lib/crypto');
const query = require('../models/query');
const {
  isLoggedIn,
  isNotLoggedIn,
} = require('../middlewares/middlewares');

const router = express.Router();

// const checkLogin = (req, res) => {
// const hmac = crypto.createHmac('sha256', 'yuni');
// let pass = hmac.update(req.session.password).digest('hex');
// pass = JSON.stringify(pass);
// if (req.session.user_name) {
//   models.Users.findOne({
//     where: {
//       user_name: req.session.user_name,
//       password: pass,
//       },
//     })
//       .catch((err) => {
//         // TODO: error handling
//         console.log(err);
//       });
//   } else {
//     res.render('login', {
//       title: 'login',
//     });
//   }
// };

/* GET users listing. */
router.get('/', isNotLoggedIn, (req, res) => {
  if (req.session.user_name) {
    // console.log(req.session);
    // console.log(req.session.user_name);
    res.render('index', {
      title: req.session.user_name,
    });
  } else {
    res.render('login', {
      title: 'login',
    });
  }
});

// login_process
router.post('/login', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      return next(authError);
    }
    if (!user) {
      req.flash('loginError', info.message);
      return res.render('login', {
        title: 'login',
      });
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        return next(loginError);
      }
      return res.render('page', {
        title: req.session.user_name,
      });
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});

router.get('/logout', isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

router.get('/page', isLoggedIn, async (req, res) => {
  // await checkLogin(req, res);
  res.render('page', {
    title: req.session.user_name,
  });
});

router.get('/join', isNotLoggedIn, (req, res) => {
  res.render('join', {
    title: 'join',
  });
});

router.post('/join', isNotLoggedIn, async (req, res) => {
  const {
    userName,
    password,
  } = req.body;
  try {
    const exUser = query.user.findOne(userName);
    if (exUser) {
      req.flash('joinError', '이미 가입 된 유저 name 입니다.');
      res.render('join', {
        title: 'join',
      });
      return;
    }
    const pass = crypto(password);
    models.Users.create({
      userName,
      password: pass,
    });
    res.render('login', {
      title: 'login',
    });
    return;
  } catch (error) {
    console.log(error);
  }
  res.render('join', {
    title: 'join',
    user: req.user,
    joinError: req.flash('joinError'),
  });
});

router.post('/page', isLoggedIn, (req, res) => {
  const { userName, password } = req.body;
  const pwd = crypto(password);
  models.Users.create({
    userName,
    password: pwd,
  })
    .then((result) => {
      console.log(result.dataValues.id);
    })
    .catch((err) => {
      console.log(err);
    });
  res.redirect('/');
});

router.delete('/', isLoggedIn, (req, res) => {
  const { userName, password } = req.session;
  const pwd = crypto(password);
  models.Users.destroy({
    where: {
      userName,
      password: pwd,
    },
  })
    .then(() => {
      req.session.destroy(() => {
        console.log('logout');
      });
    })
    .catch((err) => {
      console.log(err);
    });
  res.redirect('/');
});

module.exports = router;


const express = require('express');
const crypto = require('crypto');
const passport = require('passport');
const models = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares/middlewares');

const router = express.Router();

// const checkLogin = (req, res) => {
//   const hmac = crypto.createHmac('sha256', 'yuni');
//   let pass = hmac.update(req.session.password).digest('hex');
//   pass = JSON.stringify(pass);
//   if (req.session.user_name) {
//     models.Users.findOne({
//       where: {
//         user_name: req.session.user_name,
//         password: pass,
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
    console.log(req.session);
    console.log(req.session.user_name);
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
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      req.flash('loginError', info.message);
      return res.render('login', { title: 'login' });
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect('/');
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
    user: req.user,
    joinError: req.flash('joinError'),
  });
});

router.post('/page', isLoggedIn, (req, res) => {
  const hmac = crypto.createHmac('sha256', 'yuni');
  let pass = hmac.update(req.body.password).digest('hex');
  pass = JSON.stringify(pass);
  models.Users.create({
    user_name: req.body.user_name,
    password: pass,
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
  const hmac = crypto.createHmac('sha256', 'yuni');
  let pass = hmac.update(req.session.password).digest('hex');
  pass = JSON.stringify(pass);
  models.Users.destroy({
    where: {
      user_name: req.session.user_name,
      password: pass,
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

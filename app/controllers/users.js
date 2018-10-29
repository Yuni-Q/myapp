
const express = require('express');
const passport = require('passport');
const User = require('../mongoMedel/user');
const crypto = require('../helpers/cryptoHelper');
const {
  isLoggedIn,
  isNotLoggedIn,
} = require('../middlewares/passport/checkLogin');

const router = express.Router();

/* GET users listing. */
router.get('/', isNotLoggedIn, (req, res) => {
  if (req.session.userName) {
    // console.log(req.session);
    // console.log(req.session.userName);
    res.render('index', {
      title: req.session.userName,
    });
  } else {
    res.render('login', {
      title: 'login',
      messages: '로그인해 주세요 !!',
    });
  }
});

router.post('/', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      return next(authError);
    }
    if (!user) {
      req.flash('loginError', info.message);
      return res.render('login', {
        title: 'login',
        messages: '로그인해 주세요 !!',
      });
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        return next(loginError);
      }
      return res.redirect('/users/page');
      // return res.render('page', {
      //   title: req.session.userName,
      // });
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});

router.get('/logout', isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

router.delete('/', isLoggedIn, (req, res) => {
  const { userName, password } = req.session;
  const pwd = crypto(password);
  User.remove({
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
  res.redirect('/users');
});

module.exports = router;

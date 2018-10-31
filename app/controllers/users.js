const express = require('express');
const passport = require('passport');
const {
  isLoggedIn,
  isNotLoggedIn,
} = require('../middlewares/passport/checkLogin');

const router = express.Router();

/* GET users listing. */
router.get('/', isNotLoggedIn, (req, res) => {
  const url = `${req.protocol}://${req.host}:${process.env.PORT || '3000'}`;
  if (req.user) {
    res.redirect('/posts');
  } else {
    res.render('./users/index', {
      title: 'users',
      messages: '로그인해 주세요 !!',
      user: null,
      url,
    });
  }
});

router.post('/', isNotLoggedIn, (req, res, next) => {
  const url = `${req.protocol}://${req.host}:${process.env.PORT || '3000'}`;
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      return next(authError);
    }
    if (!user) {
      req.flash('loginError', info.message);
      return res.render('./users/index', {
        title: info.message,
        messages: '올바르지 않습니다. !!',
        user: null,
        url,
      });
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        return next(loginError);
      }
      return res.redirect('/posts');
      // return res.render('page', {
      //   title: req.session.userName,
      // });
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});

router.delete('/', isLoggedIn, async (req, res) => {
  await req.logout();

  await req.session.destroy();
  const result = 1;
  res.json(result);
});

module.exports = router;

const express = require('express');
const passport = require('passport');
const {
  isLoggedIn,
  isNotLoggedIn,
} = require('../middlewares/passport/checkLogin');

const router = express.Router();

router.post('/', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      return next(authError);
    }
    if (!user) {
      req.flash('loginError', info.message);
      res.json({
        ok: false,
        message: info.message,
        result: info,
      });
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        next(loginError);
      }
      res.json({
        ok: true,
        message: null,
        result: info,
      });
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});

router.delete('/', isLoggedIn, async (req, res) => {
  try {
    await req.logout();
    await req.session.destroy();
    res.json({
      ok: true,
      message: null,
    });
  } catch (error) {
    res.json({
      ok: false,
      message: '로그아웃중 에러 발생',
      result: error,
    });
  }
});

module.exports = router;

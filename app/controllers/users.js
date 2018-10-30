const express = require('express');
const passport = require('passport');
const {
  isLoggedIn,
  isNotLoggedIn,
} = require('../middlewares/passport/checkLogin');

const router = express.Router();

/* GET users listing. */
router.get('/', isNotLoggedIn, (req, res) => {
  if (req.user) {
    // console.log(req.session);
    // console.log(req.session.userName);
    res.render('./posts/index', {
      title: req.user.userName,
      user: req.user,
    });
  } else {
    res.render('./users/index', {
      title: 'users',
      messages: '로그인해 주세요 !!',
      user: null,
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
      res.render('./users/index', {
        title: 'users',
        messages: '올바르지 않습니다. !!',
        user: null,
      });
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        return next(loginError);
      }
      return res.json(user);
      // return res.render('page', {
      //   title: req.session.userName,
      // });
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});

router.delete('/', isLoggedIn, async (req, res) => {
  const result = await req.logout();
  await req.session.destroy();
  res.json(result);
});

module.exports = router;

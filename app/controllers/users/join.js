
const express = require('express');
const crypto = require('../../helpers/cryptoHelper');
const User = require('../../mongoMedel/user');
const query = require('../../mongoMedel/query');
const { isNotLoggedIn } = require('../../middlewares/passport/checkLogin');

const router = express.Router();


router.get('/', isNotLoggedIn, (req, res) => {
  res.render('join', {
    title: 'join',
    messages: '회원가입해 주세요.',
  });
});

router.post('/', isNotLoggedIn, async (req, res) => {
  const {
    userName,
    password,
  } = req.body;
  console.log(req.body);
  try {
    const exUser = await User.findOne({ userName });
    console.log(exUser);
    if (exUser) {
      res.render('join', {
        title: 'join',
        messages: '이미 가입 된 유저 name 입니다.',
      });
      return;
    }
    const pwd = await crypto.makePssword.makePssword(password);
    await query.User.create(userName, pwd);
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

module.exports = router;

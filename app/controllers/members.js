
const express = require('express');
const crypto = require('../helpers/cryptoHelper');
const User = require('../mongoMedel/user');
const query = require('../mongoMedel/query');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares/passport/checkLogin');

const router = express.Router();


router.get('/', isNotLoggedIn, (req, res) => {
  const { user } = req;
  res.render('./members/index', {
    title: 'members',
    messages: '회원가입해 주세요.',
    user,
  });
});

router.post('/', isNotLoggedIn, async (req, res) => {
  const { user } = req;
  const {
    userName,
    password,
  } = req.body;
  try {
    const exUser = await User.findOne({ userName });
    if (exUser) {
      res.render('./members/index', {
        title: 'members',
        messages: '이미 가입 된 유저 name 입니다.',
        user,
      });
      return;
    }
    const pwd = await crypto.makePssword(password);
    const result = await query.User.create(userName, pwd);
    res.json(result);
    return;
  } catch (error) {
    console.log(error);
    res.render('error', {
      title: 'error',
      messages: '회원 가입 중 에러 발생 !!',
    });
  }
});

router.delete('/', isLoggedIn, async (req, res) => {
  const { _id } = req.user;
  await User.deleteOne({ _id });
  await req.session.destroy(() => {
  });
  const result = 1;
  res.json(result);
});

module.exports = router;

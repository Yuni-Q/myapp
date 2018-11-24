
const express = require('express');
const crypto = require('../helpers/cryptoHelper');
const User = require('../mongoMedel/user');
const query = require('../mongoMedel/query');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares/passport/checkLogin');
// const resultFormat = require('../helpers/resultFormat');

const router = express.Router();

router.post('/', isNotLoggedIn, async (req, res) => {
  const {
    userName,
    password,
  } = req.body;
  try {
    const exUser = await User.findOne({ userName });
    if (exUser) {
      res.json({
        ok: false,
        message: '이미 가입 된 유저 name 입니다.',
      });
      return;
    }
    const pwd = await crypto.makePssword(password);
    const result = await query.User.create(userName, pwd);
    res.json({
      ok: true,
      message: null,
      result,
    });
    return;
  } catch (error) {
    console.log(error);
    res.json({
      ok: false,
      message: '회원 가입 중 에러 발생 !!',
      result: error,
    });
  }
});

router.delete('/', isLoggedIn, async (req, res) => {
  const { _id } = req.user;
  try {
    await User.deleteOne({ _id });
    await req.session.destroy();
    res.json({
      ok: true,
      message: null,
    });
  } catch (error) {
    res.json({
      ok: false,
      message: '회원 탈퇴 중 에러 발생',
      result: error,
    });
  }
});

module.exports = router;

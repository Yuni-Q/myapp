const express = require('express');
const jwt = require('jsonwebtoken');
const resultFormat = require('../helpers/resultFormat');
const Users = require('../mongoMedel/user');
const {
  isLoggedIn,
  isNotLoggedIn,
} = require('../middlewares/checkLogin');

const router = express.Router();

router.post('/', isNotLoggedIn, async (req, res) => {
  const {
    email,
    password,
  } = req.body;
  const secret = req.app.get('jwt-secret');
  const user = await Users.findOne({ email });
  console.log(user);
  if (!user) {
    res.json(resultFormat(false, '이메일이 존재하지 않습니다.'));
    return;
  }

  if (user.password === password) {
    const { _id: id } = user;
    const t = new Promise((resolve, reject) => {
      jwt.sign(
        {
          _id: id,
          nickName: user.nickName,
          email: user.email,
          admin: user.admin,
        },
        secret, {
          expiresIn: '7d',
          issuer: 'ONEPIC',
          subject: 'userInfo',
        }, (err, tt) => {
          if (err) reject(err);
          resolve(tt);
        },
      );
    });
    let result;
    await t.then(async (token) => {
      result = { token };
      console.log(result.token);
      user.token = token;
      await user.save();
      res.json(resultFormat(true, null, result));
    });
    return;
  }
  res.json(resultFormat(false, '이미 존재하는 이메일 입니다'));
});

router.delete('/', isLoggedIn, async (req, res) => {
  try {
    const { email } = req.user;
    console.log('user', req.user);
    const user = await Users.findObe({ email });
    user.token = `logout${user.token}`;
  } catch (error) {
    res.json(resultFormat(false, '에러가 발생했습니다.', error));
    return;
  }
  res.json(resultFormat(true, null));
});

module.exports = router;

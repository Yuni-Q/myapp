
const express = require('express');
const crypto = require('../../lib/crypto');
const query = require('../../models/query');
const { isNotLoggedIn } = require('../../middlewares/middlewares');

const router = express.Router();


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
    const pwd = crypto(password);
    await query.user.create(userName, pwd);
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

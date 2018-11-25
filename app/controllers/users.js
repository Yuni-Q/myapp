const express = require('express');

const resultFormat = require('../helpers/resultFormat');
const {
  isLoggedIn,
  isNotLoggedIn,
} = require('../middlewares/checkLogin');
const Users = require('../mongoMedel/user');

const router = express.Router();

router.get('/', isLoggedIn, async (req, res) => {
  try {
    const users = await Users.find({});
    console.log(users);
    res.json(resultFormat(true, null, users));
  } catch (error) {
    res.json(resultFormat(false, error.message));
  }
});

router.post('/', isNotLoggedIn, async (req, res) => {
  const {
    email,
  } = req.body;
  try {
    const exUsers = await Users.findObe({ email });
    if (exUsers) {
      res.json(resultFormat(400, '이미 가입 된 유저 name 입니다.'));
      return;
    }

    const user = new Users();
    Object.keys(req.body).forEach((key) => {
      user[key] = req.body[key];
    });
    await user.save();
    res.json(resultFormat(true, null, user));
  } catch (error) {
    res.json(resultFormat(false, error.message));
  }
});

router.put('/', isLoggedIn, async (req, res) => {
  const { _id } = req.user;
  try {
    const exUser = await Users.findOne({ _id });
    Object.keys(req.body).forEach((key) => {
      exUser[key] = req.body[key];
    });
    await exUser.save();
  } catch (error) {
    res.json(resultFormat(false, error.message));
    return;
  }
  res.json(resultFormat(true, null));
});

router.delete('/', isLoggedIn, async (req, res) => {
  const { _id } = req.user;
  try {
    const exUser = await Users.findOne({ _id });
    exUser.isDelete = true;
  } catch (error) {
    res.json(resultFormat(false, error.message));
    return;
  }
  res.json(resultFormat(true, null));
});

router.get('/:id', isLoggedIn, async (req, res) => {
  const { _id } = req.user;
  try {
    const user = await await Users.findOne({ _id });
    res.json(resultFormat(true, null, user));
  } catch (error) {
    res.json(resultFormat(false, error.message));
  }
});

module.exports = router;

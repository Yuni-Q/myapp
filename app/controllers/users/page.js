
const express = require('express');
const { isLoggedIn } = require('../../middlewares/passport/checkLogin');

const router = express.Router();


router.get('/', isLoggedIn, async (req, res) => {
  // router.get('/', async (req, res) => {
  // await checkLogin(req, res);
  res.render('page', {
    // title: req.session.userName,
    title: 'aa',
  });
});

router.post('/', isLoggedIn, async (req, res) => {
  res.redirect('/users/post');
});

module.exports = router;

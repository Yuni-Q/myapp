
const express = require('express');
const models = require('../../models');
const crypto = require('../../lib/crypto');
// const query = require('../../models/query');
const { isLoggedIn } = require('../../middlewares/middlewares');

const router = express.Router();


router.get('/page', isLoggedIn, async (req, res) => {
  // await checkLogin(req, res);
  res.render('page', {
    title: req.session.userName,
  });
});

router.post('/page', isLoggedIn, async (req, res) => {
  const { userName, password } = req.body;
  const pwd = crypto(password);
  await models.Users.create({
    userName,
    password: pwd,
  })
    .then((result) => {
      console.log(result.dataValues.id);
    })
    .catch((err) => {
      console.log(err);
    });
  res.redirect('/');
});

module.exports = router;

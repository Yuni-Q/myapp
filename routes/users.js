const express = require('express');
const crypto = require('crypto');
const models = require('../models');


const router = express.Router();

const checkLogin = (req, res) => {
  const hmac = crypto.createHmac('sha256', 'yuni');
  let pass = hmac.update(req.session.password).digest('hex');
  pass = JSON.stringify(pass);
  if (req.session.user_name) {
    models.Users.findOne({
      where: {
        user_name: req.session.user_name,
        password: pass,
      },
    })
      .then((result) => {
        if (result) {
          console.log(result);
        }
      })
      .catch((err) => {
        // TODO: error handling
        console.log(err);
      });
  } else {
    res.render('login', {
      title: 'login',
    });
  }
};
/* GET users listing. */
router.get('/', (req, res) => {
  if (req.session.user_name) {
    console.log(req.session);
    console.log(req.session.user_name);
    res.render('index', {
      title: req.session.user_name,
    });
  } else {
    res.render('login', {
      title: 'login',
    });
  }
});

router.post('/login_process', (req, res) => {
  const hmac = crypto.createHmac('sha256', 'yuni');
  let pass = hmac.update(req.body.password).digest('hex');
  pass = JSON.stringify(pass);
  console.log(models);
  models.Users.findOne({
    where: {
      user_name: req.body.user_name,
      password: pass,
    },
  })
    .then((result) => {
      if (result) {
        req.session.user_name = req.body.user_name;
        req.session.password = req.body.password;
        res.render('page', {
          title: req.body.user_name,
        });
      } else {
        res.render('login', {
          title: 'login 실패',
        });
      }
    })
    .catch((err) => {
      // TODO: error handling
      console.log(err);
    });
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    console.log('logout');
  });
  res.render('login', {
    title: 'login',
  });
});

router.get('/page', async (req, res) => {
  await checkLogin(req, res);
  res.render('page', {
    title: req.session.user_name,
  });
});

router.get('/join', (req, res) => {
  res.render('join', {
    title: 'join',
  });
});

router.post('/join_process', (req, res) => {
  const hmac = crypto.createHmac('sha256', 'yuni');
  let pass = hmac.update(req.body.password).digest('hex');
  pass = JSON.stringify(pass);
  models.Users.create({
    user_name: req.body.user_name,
    password: pass,
  })
    .then((result) => {
      console.log(result.dataValues.id);
    })
    .catch((err) => {
      console.log(err);
    });
  res.redirect('/');
});

router.get('/delete', (req, res) => {
  const hmac = crypto.createHmac('sha256', 'yuni');
  let pass = hmac.update(req.session.password).digest('hex');
  pass = JSON.stringify(pass);
  models.Users.destroy({
    where: {
      user_name: req.session.user_name,
      password: pass,
    },
  })
    .then(() => {
      req.session.destroy(() => {
        console.log('logout');
      });
    })
    .catch((err) => {
      console.log(err);
    });
  res.redirect('/');
});
module.exports = router;

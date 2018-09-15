var express = require('express');
var router = express.Router();
var models = require("../models")


checkLogin = (req, res) => {
  if (req.session.user_name) {
    models.users.findOne({
      where: {
        user_name: req.session.user_name,
        password: req.session.password
      }
    }).then(result => {
      if (result.dataValues.user_name == req.session.user_name && result.dataValues.password == req.session.password) {} else {
        res.render('login', {
          title: 'login'
        });
      }
    }).catch(function (err) {
      //TODO: error handling
      console.log(err)
    });;
  } else {
    res.render('login', {
      title: 'login'
    });
  }
}
/* GET users listing. */
router.get('/', function (req, res, next) {
  if (req.session.user_name) {
    console.log(req.session)
    console.log(req.session.user_name)
    res.render('index', {
      title: req.session.user_name
    });
  } else {
    res.render('login', {
      title: 'login'
    });
  }
});

router.post('/login_process', function (req, res, next) {
  models.users.findOne({
    where: {
      user_name: req.body.user_name,
      password: req.body.password
    }
  }).then(result => {
    if (result) {
      if (result.dataValues.user_name = req.body.user_name && result.dataValues.password == req.body.password) {
        req.session.user_name = req.body.user_name
        req.session.password = req.body.password
        res.render('page', {
          title: req.body.user_name
        });
      } else {
        res.redirect("/users/page");
      }
    } else {
      res.render('login', {
        title: 'login'
      });
    }
  }).catch(function (err) {
    //TODO: error handling
    console.log(err)
  });;
});


router.get('/logout', function (req, res, next) {
  req.session.destroy(function (err) {
    console.log("logout")
  })
  res.render('login', {
    title: 'login'
  })
})

router.get('/page', async function (req, res, next) {
  await checkLogin(req, res);
  res.render('page', {
    title: req.session.user_name
  })
})

router.get('/join', function (req, res, next) {
  res.render('join', {
    title: 'join'
  })
})

router.post('/join_process', function (req, res, next) {
  models.users.create({
    user_name: req.body.user_name,
    password: req.body.password
  }).catch(function (err) {
    console.log(err)
  });
  res.redirect("/")
})

router.get('/delete', function (req, res, next) {
  models.users.destroy({
    where: {
      user_name: req.session.user_name,
      password: req.session.password
    }
  }).catch(function (err) {
    console.log(err)
  });
  res.redirect("/")
})
module.exports = router;
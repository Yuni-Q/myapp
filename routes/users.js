var express = require("express");
var router = express.Router();
var models = require("../models");
var crypto = require("crypto");

checkLogin = (req, res) => {
  var hmac = crypto.createHmac("sha256", "yuni");
  var pass = hmac.update(req.session.password).digest("hex");
  pass = JSON.stringify(pass);
  if (req.session.user_name) {
    models.Users.findOne({
      where: {
        user_name: req.session.user_name,
        password: pass
      }
    })
      .then(result => {
        if (result) {
        }
      })
      .catch(function(err) {
        //TODO: error handling
        console.log(err);
      });
  } else {
    res.render("login", {
      title: "login"
    });
  }
};
/* GET users listing. */
router.get("/", function(req, res, next) {
  if (req.session.user_name) {
    console.log(req.session);
    console.log(req.session.user_name);
    res.render("index", {
      title: req.session.user_name
    });
  } else {
    res.render("login", {
      title: "login"
    });
  }
});

router.post("/login_process", function(req, res, next) {
  var hmac = crypto.createHmac("sha256", "yuni");
  var pass = hmac.update(req.body.password).digest("hex");
  pass = JSON.stringify(pass);
  console.log(models);
  models.Users.findOne({
    where: {
      user_name: req.body.user_name,
      password: pass
    }
  })
    .then(result => {
      if (result) {
        req.session.user_name = req.body.user_name;
        req.session.password = req.body.password;
        res.render("page", {
          title: req.body.user_name
        });
      } else {
        res.render("login", {
          title: "login 실패"
        });
      }
    })
    .catch(function(err) {
      //TODO: error handling
      console.log(err);
    });
});

router.get("/logout", function(req, res, next) {
  req.session.destroy(function(err) {
    console.log("logout");
  });
  res.render("login", {
    title: "login"
  });
});

router.get("/page", async function(req, res, next) {
  await checkLogin(req, res);
  res.render("page", {
    title: req.session.user_name
  });
});

router.get("/join", function(req, res, next) {
  res.render("join", {
    title: "join"
  });
});

router.post("/join_process", function(req, res, next) {
  var hmac = crypto.createHmac("sha256", "yuni");
  var pass = hmac.update(req.body.password).digest("hex");
  pass = JSON.stringify(pass);
  models.Users.create({
    user_name: req.body.user_name,
    password: pass
  })
    .then(result => {
      console.log("//////////");
      console.log(result.dataValues.id);
      console.log("//////////");
    })
    .catch(function(err) {
      console.log(err);
    });
  res.redirect("/");
});

router.get("/delete", function(req, res, next) {
  var hmac = crypto.createHmac("sha256", "yuni");
  var pass = hmac.update(req.session.password).digest("hex");
  pass = JSON.stringify(pass);
  models.Users.destroy({
    where: {
      user_name: req.session.user_name,
      password: pass
    }
  })
    .then(result => {
      req.session.destroy(function(err) {
        console.log("logout");
      });
    })
    .catch(function(err) {
      console.log(err);
    });
  res.redirect("/");
});
module.exports = router;

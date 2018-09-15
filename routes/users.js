var express = require('express');
var router = express.Router();
var db = require("../models")

/* GET users listing. */
router.get('/', function(req, res, next) {
  db.query('SELECT * from USERS', function(err, rows, fields) {
    if (!err)
      console.log('The solution is: ', rows);
    else
      console.log('Error while performing Query.', err);
  });  
  res.send('respond with a resource');
});

module.exports = router;

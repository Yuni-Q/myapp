var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  res.cookie("name","Yun");
  res.render('index', { title: 'Yuni-Q' });
  
  // 쿠키 세팅
  // res.cookie(key,value,{options});

  // 쿠키 사용
  // req.cookies.key

  // 쿠키 삭제
  // res.clearCookie(key);
  // res.clearCookie(key, {path:'/path'});


});

module.exports = router;

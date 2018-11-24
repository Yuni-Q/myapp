const express = require('express');

const jwt = require('jwt-simple');
const auth = require('../middlewares/passport/auth')();
const users = require('./users');
const cfg = require('../../secret/jwt_config');

const router = express.Router();
// 로그인 요청을 처리한다.
// 1. body 에 포함된 전화번호와 암호가 일치하는 사용자를 찾는다.
// 2. 토큰(payload + 비밀키) 생성 및 전송
router.post('/login', (req, res) => {
  if (req.body.phone && req.body.password) {
    const {
      phone,
    } = req.body;
    const {
      password,
    } = req.body;
    const user = users.find(u => u.phone === phone && u.password === password);
    if (user) {
      const payload = {
        id: user.id,
      };
      const token = jwt.encode(payload, cfg.jwtSecret);
      res.json({
        token,
      });
    } else {
      res.sendStatus(401);
    }
  } else {
    res.sendStatus(401);
  }
});
// 클라이언트로부터 전송된 요청 헤더에 포함된 토큰으로부터 사용자 정보를 반환한다.
router.get('/secret', auth.authenticate(), (req, res) => {
  res.send(req.user);
});
module.exports = router;

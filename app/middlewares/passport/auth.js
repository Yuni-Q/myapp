
const passport = require('passport');
const passportJWT = require('passport-jwt');

const users = require('../../models/user');
const cfg = require('../../../secret/jwt_config');

const { ExtractJwt } = passportJWT;
const { Strategy } = passportJWT;
const params = {
  // JWT 비밀키
  secretOrKey: cfg.jwtSecret,
  // 클라이언트에서 서버로 토큰을 전달하는 방식  (header, querystring, body 등이 있다.)
  // header 의 경우 다음과 같이 써야 한다 { key: 'Authorization', value: 'JWT' + 토큰
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
};
module.exports = () => {
  const strategy = new Strategy(params, (payload, done) => {
    // TODO write authentications to find users from a database
    const user = users.find(u => u.id === payload.id);
    if (user) {
      done(null, {
        id: user.id,
      });
    } else {
      done(new Error('User not found'), null);
    }
  });
  passport.use(strategy);
  return {
    initialize: () => passport.initialize(),
    authenticate: () => passport.authenticate('jwt', cfg.jwtSession),
  };
};

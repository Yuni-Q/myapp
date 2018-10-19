const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
const models = require('../../models');

const hmac = crypto.createHmac('sha256', 'yuni');

module.exports = (passport) => {
  passport.use(new LocalStrategy({
    usernameField: 'userName',
    passwordField: 'password',
  }, async (userName, password, done) => {
    try {
      const exUser = await models.User.find({ where: { userName } });
      if (exUser) {
        const result = await (JSON.stringify(hmac.update(password).digest('hex'))).compare(exUser.password);
        if (result) {
          done(null, exUser);
        } else {
          done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
        }
      } else {
        done(null, false, { message: '가입되지 않은 회원입니다.' });
      }
    } catch (error) {
      console.log(error);
      done(error);
    }
  }));
};

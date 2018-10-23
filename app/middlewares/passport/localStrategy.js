const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
const models = require('../../models');

const hmac = crypto.createHmac('sha256', 'yuni');

module.exports = (passport) => {
  passport.use(new LocalStrategy({
    usernameField: 'userName',
    passwordField: 'password',
  }, async (username, password, done) => {
    console.log('bbbbb', username, password, done);
    try {
      const exUser = await models.Users.findOne({ where: { username } });
      console.log(exUser.dataValues);
      if (exUser) {
        const pwd = await JSON.stringify(hmac.update(password).digest('hex'));
        console.log(pwd);
        const result = await (pwd === (exUser.dataValues.password));
        if (result) {
          done(null, exUser.dataValues);
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

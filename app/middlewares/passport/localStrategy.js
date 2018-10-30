
const LocalStrategy = require('passport-local').Strategy;
const User = require('../../mongoMedel/user');
const crypto = require('../../helpers/cryptoHelper');

module.exports = async (passport) => {
  passport.use(new LocalStrategy({
    usernameField: 'userName',
    passwordField: 'password',
  }, async (username, password, done) => {
    try {
      const exUser = await User.findOne({ userName: username });
      if (exUser) {
        const pwd = await crypto.makePssword(password);
        const result = await (pwd === (exUser.password));
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

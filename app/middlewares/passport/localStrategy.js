const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
const User = require('../../mongoMedel/user');

const hmac = crypto.createHmac('sha256', 'yuni');

module.exports = (passport) => {
  passport.use(new LocalStrategy({
    usernameField: 'userName',
    passwordField: 'password',
  }, async (username, password, done) => {
    try {
      const exUser = await User.findOne({ userName: username });
      if (exUser) {
        const pwd = await JSON.stringify(hmac.update(password).digest('hex'));
        const result = await (pwd === (exUser.password));
        if (result) {
          console.log('2');
          done(null, exUser);
        } else {
          console.log('3');
          done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
        }
      } else {
        console.log('4');
        done(null, false, { message: '가입되지 않은 회원입니다.' });
      }
    } catch (error) {
      console.log('5');
      console.log(error);
      done(error);
    }
  }));
};


const local = require('./localStrategy');
const User = require('../../mongoMedel/user');

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    // 첫번째인자 error
    done(null, user.id);
  });

  // 매 요청 시 실행
  passport.deserializeUser(async (_id, done) => {
    const user = await User.findOne({ _id });
    done(null, user);
  });

  local(passport);
};

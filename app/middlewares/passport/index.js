const local = require('./localStrategy');
const models = require('../../models');

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    // 첫번째인자 error
    done(null, user.id);
  });

  // 매 요청 시 실행
  passport.deserializeUser((id, done) => {
    models.User.find({ where: { id } })
      .then(user => done(null, user))
      .catch(err => done(err));
  });

  local(passport);
};

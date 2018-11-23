
// Passport는 req 객체에 isAuthenticated 메서드를 추가합니다.
// 로그인 중이면 true
exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.json({
      ok: false,
      message: '로그인이 필요합니다.',
    });
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.json({
      ok: false,
      message: '이미 로그인 되어 있습니다.',
    });
  }
};

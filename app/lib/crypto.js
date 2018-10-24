
const crypto = require('crypto');

const makePssword = (password) => {
  const hmac = crypto.createHmac('sha256', 'yuni');
  let pwd = hmac.update(password).digest('hex');
  pwd = JSON.stringify(pwd);
  return pwd;
};

exports.default = makePssword;

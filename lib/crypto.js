
const crypto = require('crypto');

exports.makePssword = {
  async makePssword(password) {
    const hmac = await crypto.createHmac('sha256', 'yuni');
    let pwd = await hmac.update(password).digest('hex');
    pwd = await JSON.stringify(pwd);
    return pwd;
  },
};

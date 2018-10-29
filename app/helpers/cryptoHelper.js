
const crypto = require('crypto');

exports.makePssword = {
  async makePssword(password) {
    const hmac = await crypto.createHmac('sha256', 'yuni');
    const pwd = await hmac.update(password).digest('hex');
    return pwd;
  },
};

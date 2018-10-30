
const crypto = require('crypto');

module.exports = {
  async makePssword(password) {
    const hmac = await crypto.createHmac('sha256', 'yuni');
    const pwd = await hmac.update(password).digest('hex');
    return pwd;
  },
};

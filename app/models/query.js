
const models = require('../models');

exports.user = {
  findOne(userName) {
    return models.Users.findOne({
      where: {
        userName,
      },
    });
  },

  create(userName, pwd) {
    return models.Users.create({
      userName,
      password: pwd,
    });
  },
};

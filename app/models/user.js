// "use strict";
// const Sequelize = require('sequelize');

module.exports = (Sequelize, DataTypes) => {
  const Users = Sequelize.define(
    'Users',
    {
      userName: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {},
  );
  // Users.associate = (models) => {
  //   // associations can be defined here
  // };
  return Users;
};

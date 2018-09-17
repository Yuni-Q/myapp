"use strict";
const Sequelize = require("sequelize");

module.exports = (Sequelize, DataTypes) => {
  const Users = Sequelize.define(
    "Users",
    {
      user_name: DataTypes.STRING,
      password: DataTypes.STRING
    },
    {}
  );
  Users.associate = function(models) {
    // associations can be defined here
  };
  return Users;
};

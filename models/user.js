// 'use strict';
// const Sequelize = require('sequelize');

// module.exports = (Sequelize, DataTypes) => {
//   const User = Sequelize.define('User', {
//     user_name: DataTypes.STRING,
//     password: DataTypes.STRING
//   }, {});
//   User.associate = function (models) {
//     // associations can be defined here
//   };
//   return User;
// };

const Sequelize = require("sequelize");

module.exports = db => {
  const Users = db.define(
    "Users",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_name: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      }
    },
    {
      validations: {},
      methods: {},
      tableName: "Users",
      timestamps: false,
      underscored: false
    }
  );

  return Users;
};

const Sequelize = require("sequelize");

module.exports = db => {
  const users = db.define(
    "users",
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
        type: Sequelize.INTEGER
      }
    },
    {
      validations: {},
      methods: {},
      tableName: "users",
      timestamps: false,
      underscored: false
    }
  );

  return users;
};
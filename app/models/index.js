const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
global.config = require('config');

const db = {};

const sequelize = new Sequelize(global.config.database.dbname, global.config.database.user, global.config.database.password, {
  host: global.config.database.host,
  port: global.config.database.port,
  dialect: global.config.database.protocol,
  username: global.config.database.user,
  password: global.config.database.password,
  define: {
    freezeTableName: true,
  },
  pool: {
    max: 120,
    min: 0,
    idle: 10000,
  },
});

fs
  .readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0) && (file !== 'index.js') && (file !== 'query.js') && (file !== 'v2'))
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;

module.exports = db;

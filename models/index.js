const config = require('../config/default.json');
const mysql = require('mysql');
const db = mysql.createConnection({
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database
});

db.connect();

module.exports = db;
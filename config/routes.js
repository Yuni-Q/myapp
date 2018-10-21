
const fs = require('fs');
const path = require('path');
const controllers = require('../app/controllers');

// const API_VERSION = `/api/${global.config.app.version}`;
const BASE_PATH = path.join(__dirname, '../app/controllers');

function findRouter(app, dir) {
  fs
    .readdirSync(dir)
    .filter(file => (file.indexOf('.') !== 0) && (file !== 'index.js') && (file !== 'locales') && (file !== 'feed.js'))
    .forEach((file) => {
      file = `${dir}/${file}`;
      const stat = fs.statSync(file);
      if (stat && stat.isDirectory()) {
        console.log(`DIR ${file}`);
        findRouter(app, file);
      } else {
        const localPath = `${file.split(`${BASE_PATH}/`)[1].split('.')[0]}`;
        console.log(`/${localPath}`);
        app.use(`/${localPath}`, controllers[localPath.replace(/\//g, '_')]);
      }
    });
}

module.exports = (app) => {
  findRouter(app, BASE_PATH);
  console.log('\r');
};


const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const compression = require('compression');
const bearerToken = require('express-bearer-token');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport'); // passport module add
const flash = require('connect-flash');
const passportConfig = require('../app/middlewares/passport');


global.config = require('config');

module.exports = (app) => {
  app.use(bodyParser.json());

  app.use(bodyParser.urlencoded({
    extended: true,
  }));

  // CORS 설정
  app.use(cors());

  passportConfig(passport);
  app.use(cookieParser());
  app.use(
    session({
      resave: true,
      saveUninitialized: false,
      secret: global.config.app.sessionSecret,
      cookie: {
        httpOnly: true,
        secure: false,
      },
    }),
  );
  app.use(compression());
  app.use(bearerToken());


  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());

  // view engine setup
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, '/../app/views'));
  app.set('trust proxy', true);

  app.disable('etag');
  app.disable('x-powered-by');

  console.log('---------------------------------------------------------------');
  console.log('[%s] running by [%s]', global.config.app.name, global.config.app.env);
  console.log('\r');

  // /* =======================
  //  CONNECT TO MONGODB SERVER
  // ==========================*/
  mongoose.connect(global.config.mongo.mongodbUri);
  mongoose.connect(global.config.mongo.mongodbUri, { useNewUrlParser: true });
  const db = mongoose.connection;
  db.on('error', console.error);
  db.once('open', () => {
    console.log('connected to mongodb server');
  });
};

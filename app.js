
const path = require('path');
const logger = require('morgan');
const express = require('express');
// const schedule = require('node-schedule');
const createError = require('http-errors');
const swaggerUi = require('swagger-ui-express');
const indexRouter = require('./routes/index');
// const usersRouter = require('./routes/users');
const route = require('./config/routes');
const swaggerDocument = require('./swagger.json');
const environment = require('./config/environment');
// const daliyLogger = require('./lib/logger');


const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
// app.use('/users', usersRouter);
environment(app);
route(app);
app.use('/apiDocs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// const rule = new schedule.RecurrenceRule();
// // rule.hour = 00;
// // rule.minute = 30;
// rule.second = 30;

// schedule.scheduleJob(rule, () => {
//   daliyLogger.info('info');
// });

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

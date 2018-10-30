
const winston = require('winston');
require('winston-daily-rotate-file');

// const levels = {
//   error: 0,
//   warn: 1,
//   info: 2,
//   verbose: 3,
//   debug: 4,
//   silly: 5,
// };

const myFormat = winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`);

const logger = winston.createLogger({
  format: winston.format.combine(
    // winston.format.label({ label: 'right meow!' }),
    winston.format.timestamp(),
    myFormat,
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console({
      // format: winston.format.simple(),
      level: 'debug',
      colorize: true,
    }),
    // new winston.transports.Console(),
    new winston.transports.DailyRotateFile({
      filename: '../../logs/app-debug-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'debug',
    }),
  ],
});

module.exports = logger;

const { join } = require("path");
const { createLogger, format, transports } = require("winston");
const winstonDaily = require("winston-daily-rotate-file");

const logLevels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
};

const LOG_DIR = "logs";
const logDir = join(__dirname, "../../", LOG_DIR); // at Project Level

const logFormat = format.printf(
  ({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`
);

const logger = createLogger({
  format: format.combine(
    format.timestamp({
      format: "DD-MM-YYYY HH:mm:ss",
    }),
    logFormat
  ),
  levels: logLevels,
  transports: [
    new transports.Console(),
    // debug log setting
    new winstonDaily({
      level: "debug",
      datePattern: "DD-MM-YYYY",
      dirname: logDir + "/debug", // log file /logs/debug/*.log in save
      filename: `%DATE%.log`,
      maxFiles: 30, // 30 Days saved
      json: false,
      zippedArchive: true,
    }),
    // error log setting
    new winstonDaily({
      level: "error",
      datePattern: "DD-MM-YYYY",
      dirname: logDir + "/error", // log file /logs/error/*.log in save
      filename: `%DATE%.log`,
      maxFiles: 30, // 30 Days saved
      handleExceptions: true,
      json: false,
      zippedArchive: true,
    }),
  ],
});

module.exports = logger;

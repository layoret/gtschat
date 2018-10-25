//winston-config-rotate.js
var path = require("path");
var fs = require("fs");
var appRoot = require("app-root-path");
const winston = require("winston");
require('winston-mongodb');
var db = require("./db");
var clfDate = require("clf-date");
require("winston-daily-rotate-file");

// ensure log directory exists
var logDirectory = path.resolve(`${appRoot}`, "logs");
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
var infodb = new winston.transports.MongoDB({
    level: "info",
    db: "mongodb://127.0.0.1/miApp",
});
var infofile = new winston.transports.DailyRotateFile({
    level: "info",
    filename: path.resolve(logDirectory, "bifrost-%DATE%-info.log"),
    datePattern: "YYYY-MM-DD-HH",
    zippedArchive: true,
    handleExceptions: true,
    maxSize: "100m",
    json: true,
    maxFiles: "14d" // keep logs for 14 days
});
infofile.on("rotate", function(oldFilename, newFilename) {
    // do something fun
});

var errorfile = new winston.transports.DailyRotateFile({
    level: "error",
    filename: path.resolve(logDirectory, "bifrost-%DATE%-error.log"),
    datePattern: "YYYY-MM-DD-HH",
    zippedArchive: true,
    handleExceptions: true,
    json: true,
    maxSize: "20m",
    maxFiles: "30d", // keep logs for 30 days

});
var wconsole = new winston.transports.Console({
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: false
})
errorfile.on("rotate", function(oldFilename, newFilename) {
    // do something fun
});

const logger = winston.createLogger({
    transports: [infofile, errorfile, wconsole,infodb]
});

// create a stream object with a 'write' function that will be used by `morgan`. This stream is based on node.js stream https://nodejs.org/api/stream.html.
logger.stream = {
    write: function(message, encoding) {
        // use the 'info' log level so the output will be picked up by both transports
        logger.info(message);
    }

};
// create a format method for winston, it is similar with 'combined' format in morgan
logger.combinedFormat = function(err, req, res) {
    // :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"
    return `${req.ip} - - [${clfDate(
    new Date()
  )}] ${req.method} ${req.originalUrl} HTTP/${req.httpVersion} ${err.status ||
    500} - ${req.headers["user-agent"]}`;
};
// create a format method for winston, it is similar with 'combined' format in morgan
logger.combinedFormat2 = function(req, res) {
    // :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"
    return ` [${clfDate(
        new Date()
      )}] From ${req.ip} - Method -${req.method} ${req.originalUrl} HTTP/${req.httpVersion} ${req.headers["content-type"] ||
    "500"} - ${req.headers["user-agent"]} `;
};
module.exports = logger;
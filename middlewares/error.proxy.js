const logger = require('../helpers/logger')
var loggermw = function(err, req, res, next) {
    res.status(err.status || 500);
    //logger.error(err.message, err);
    logger.error({ message: logger.combinedFormat2(req, res) }, { meta: { status: err.status, _date: Date.now() } });
    res.render('error', {
        layout: "error",
        message: err.message,
        error: err.status
    });
  
}
module.exports = loggermw;
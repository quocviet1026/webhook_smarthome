const logEvents = require('../helpers/logEvent');

const errorHandle = (err, req, res, next) => {
  console.error(`err: ${err}`);
  logEvents(`${req.url} --- ${req.method} --- ${err.message}`);
  res.json({
    status: err.status || 500,
    message: err.message,
  });
};

module.exports = errorHandle;

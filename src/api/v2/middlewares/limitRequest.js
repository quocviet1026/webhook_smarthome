const { incr, expire, ttl } = require('../helpers/limiter.js');

const limitRequest = async (req, res, next) => {
  const IpUser = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const numRequest = await incr(IpUser);
  let _ttl;

  if (numRequest === 1) {
    await expire(IpUser, 60);
    _ttl = 60;
  } else {
    _ttl = await ttl(IpUser);
  }

  if (numRequest > 20) {
    // number request > 20time / 60second => Reject
    return res.status(503).json({
      status: 'error',
      _ttl,
      message: 'Server is busy!',
      numRequest,
    });
  }
  next();
};

module.exports = limitRequest;

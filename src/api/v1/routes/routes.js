const express = require('express');

const route = express.Router();
route.use('/user', require('../users/user.route'));
route.use(
  '/googleAuth',
  require('../thirdpartyAuth/googleAuth/googleAuth.route')
);
route.use(
  '/smarthome',
  require('../smarthome/thirdpartyHandle/google/fulfillment/fulfillment.route')
);

module.exports = route;

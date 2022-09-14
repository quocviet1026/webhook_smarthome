const express = require('express');

const route = express.Router();
route.use('/user', require('../users/user.route'));
// eslint-disable-next-line prettier/prettier
route.use('/googleAuth',require('../thirdpartyAuth/googleAuth/googleAuth.route'));
route.use('/olliAuth', require('../thirdpartyAuth/olliAuth/olliAuth.route'));
// eslint-disable-next-line prettier/prettier
route.use('/smarthomeGoogle',require('../smarthome/thirdpartyHandle/google/fulfillment/fulfillment.route'));
// eslint-disable-next-line prettier/prettier
route.use('/smarthomeOlli',require('../smarthome/thirdpartyHandle/olli/fulfillment/fulfillment.route'));

module.exports = route;

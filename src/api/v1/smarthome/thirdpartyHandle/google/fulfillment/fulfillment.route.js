const express = require('express');
const fullfillmentController = require('./fulfillment.controller.js');

const fullfillmentRoute = express.Router();

fullfillmentRoute.all('/', fullfillmentController);

module.exports = fullfillmentRoute;

const express = require('express');
const olliAuthController = require('./olliAuth.controller');

const olliAuthRoute = express.Router();

olliAuthRoute.get('/auth', olliAuthController.authorization);
olliAuthRoute.post('/token', olliAuthController.token);

module.exports = olliAuthRoute;

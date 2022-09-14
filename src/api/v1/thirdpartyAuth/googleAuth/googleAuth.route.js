const express = require('express');
const googleAuthController = require('./googleAuth.controller');

const googleAuthRoute = express.Router();

googleAuthRoute.get('/auth', googleAuthController.authorization);
googleAuthRoute.post('/token', googleAuthController.token);

module.exports = googleAuthRoute;

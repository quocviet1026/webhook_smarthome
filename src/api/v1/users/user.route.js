const express = require('express');
const userController = require('./user.controller');

const userRoute = express.Router();

userRoute.get('/', (req, res, next) => {
  res.send('HOME PAGE');
});

userRoute.post('/register', userController.register);
userRoute.get('/login', userController.loginGet);
userRoute.post('/login', userController.loginPost);
userRoute.post('/refreshToken', userController.refreshToken);
userRoute.delete('/logout', userController.logout);

module.exports = userRoute;

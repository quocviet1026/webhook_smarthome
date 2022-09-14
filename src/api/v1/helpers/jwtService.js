const JWT = require('jsonwebtoken');
const createError = require('http-errors');
const redisDb = require('../database/redisDb');

module.exports = {
  signAuthorizationCode: (userId) =>
    new Promise((resolve, reject) => {
      const payload = {
        userId,
      };

      const secret = process.env.AUTHORIZATION_TOKEN_SECRET;

      const option = {
        expiresIn: '10m', // google standard is 10m
      };

      JWT.sign(payload, secret, option, (err, token) => {
        if (err) {
          reject(err);
        }
        resolve(token);
      });
    }),

  verifyAuthorizationCode: (authorizationCode) =>
    new Promise((resolve, reject) => {
      JWT.verify(
        authorizationCode,
        process.env.AUTHORIZATION_TOKEN_SECRET,
        (err, payload) => {
          if (err) {
            return reject(err);
          }
          resolve(payload);
        }
      );
    }),

  signAccessToken: (userId) =>
    new Promise((resolve, reject) => {
      const payload = {
        userId,
      };

      const secret = process.env.ACCESS_TOKEN_SECRET;

      const option = {
        expiresIn: '1h', // standard is 1h
      };

      JWT.sign(payload, secret, option, (err, token) => {
        if (err) {
          reject(err);
        }
        resolve(token);
      });
    }),

  verifyAccessToken: (req, res, next) => {
    // Check accessToken in request header exist
    if (!req.headers.authorization) {
      return next(createError.Unauthorized());
    }

    const authHeader = req.headers.authorization;
    const bearerToken = authHeader.split(' ');
    const accessToken = bearerToken[1];

    // Verify AccessToken:
    JWT.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
      if (err) {
        if (err.name === 'JsonWebTokenError') {
          return next(createError.Unauthorized());
        }
        return next(createError.Unauthorized(err.message));
      }

      //   console.log('payload: ', payload);
      req.payload = payload;
      //   console.log('req.payload: ', req.payload);
      next();
    });
  },

  validateCredentials: (headers) =>
    new Promise((resolve, reject) => {
      console.log('validateCredentials, headers:', headers);
      // Check accessToken in request header exist
      if (!headers.authorization) {
        reject(createError.BadRequest());
      }

      const authHeader = headers.authorization;
      const bearerToken = authHeader.split(' ');
      const accessToken = bearerToken[1];

      console.log('accessToken: ', accessToken);

      // Verify AccessToken:
      JWT.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET,
        (err, payload) => {
          if (err) {
            console.log('JWT.verify error: ', err);
            if (err.name === 'JsonWebTokenError') {
              reject(createError.Unauthorized());
            }
            reject(createError.Unauthorized(err.message));
          }

          console.log('payload: ', payload);
          resolve(payload);
        }
      );
    }),

  signRefreshToken: (userId) =>
    new Promise((resolve, reject) => {
      const payload = {
        userId,
      };

      const secret = process.env.REFRESH_TOKEN_SECRET;

      const option = {
        expiresIn: '1y', // standard is 1y
      };

      // Generate RefreshToken and save to Redis
      JWT.sign(payload, secret, option, (err, token) => {
        if (err) {
          reject(err);
        }

        redisDb
          .set(userId.toString(), token, {
            EX: 365 * 24 * 24 * 60,
          })
          .then((result) => {
            console.log(
              `set ${userId.toString()} : ${token} to Redis: ${result}`
            );
            resolve(token);
          })
          .catch((err) => {
            reject(err);
          });
      });
    }),

  verifyRefreshToken: (refreshToken) =>
    // Verify refreshToken:
    new Promise((resolve, reject) => {
      JWT.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, payload) => {
          if (err) {
            return reject(err);
          }
          // get Payload (include userId) -> Check Refresh Token Exist in Database (redis) by key = useId
          redisDb
            .get(payload.userId)
            .then((data) => {
              // Compare refreshToken in request and refreshToken in Database
              if (data === refreshToken) {
                return resolve(payload);
              }
              throw createError.BadRequest('Refresh token not match');
            })
            .catch((err) => reject(err));
        }
      );
    }),
};

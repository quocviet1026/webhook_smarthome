/* eslint-disable camelcase */
require('dotenv').config();
const createError = require('http-errors');
const jwtService = require('../../helpers/jwtService');

module.exports = {
  /* Handle authorization request: */
  authorization: (req, res, next) => {
    console.log(
      '\n\n---------->>>>>>>>>> HANDLE AUTHORIZATION REQUEST <<<<<<<<<<----------'
    );
    console.log('req.query: ', req.query);

    try {
      const {
        // eslint-disable-next-line camelcase
        client_id,
        redirect_uri,
        state,
        scope,
        // eslint-disable-next-line no-unused-vars
        response_type,
        // eslint-disable-next-line no-unused-vars
        user_locale,
      } = req.query;

      console.log('client_id: ', client_id);
      console.log('redirect_uri: ', redirect_uri);
      console.log('state: ', state);
      console.log('scope: ', scope);
      console.log('response_type: ', response_type);
      console.log('user_locale: ', user_locale);

      /**
       * 1. Verify that the client_id matches the Client ID you assigned to Google,
       * and that the redirect_uri matches the redirect URL provided by Google for your service
       */
      if (client_id !== process.env.GOOGLE_SMARTHOME_CLIENT_ID) {
        console.error(`client_id invalid: ${client_id}`);
        throw createError.BadRequest();
      }

      const queryLogin = `?redirect_uri=${redirect_uri}&state=${state}`;
      console.log('queryLogin: ', queryLogin);

      const redirectUrl = `/v2/user/login${queryLogin}`;
      console.log('redirectUrl: ', redirectUrl);

      // Redirect to route GET /v2/user/login
      return res.redirect(redirectUrl);
    } catch (error) {
      next(error);
    }
  },

  /* Handle token exchange request: */
  token: async (req, res, next) => {
    console.log(
      '\n\n---------->>>>>>>>>> HANDLE TOKEN EXCHANGE REQUESTS <<<<<<<<<<----------'
    );
    console.log('req.body: ', req.body);

    try {
      const { client_id, client_secret, grant_type } = req.body;
      console.log('   client_id: ', client_id);
      console.log('   client_secret: ', client_secret);
      console.log('   grant_type: ', grant_type);

      /**
       * 1. Verify that the client_id identifies the request origin as an authorized origin,
       * and that the client_secret matches the expected value.
       */
      if (
        client_id !== process.env.GOOGLE_SMARTHOME_CLIENT_ID ||
        client_secret !== process.env.GOOGLE_SMARTHOME_CLIENT_SECRET
      ) {
        console.log('ERROR,  Secret!');
        return res.status(400).send({ error: 'invalid_grant' });
      }

      let userId;
      let payload;
      let credentials;

      switch (grant_type) {
        case 'authorization_code': {
          /* Exchange authorization codes for access tokens and refresh tokens */
          if (!req.body.code) {
            console.error(`code invalid`);
            throw createError.BadRequest(`code invalid: ${req.body.code}`);
          }

          // verify authorizationCode and get userId
          payload = await jwtService.verifyAuthorizationCode(req.body.code);
          userId = payload.userId;
          // generate accessToken, refreshToken for user
          const accessTokenAuthExchange = await jwtService.signAccessToken(
            userId
          ); // generate accessToken
          const refreshTokenAuthExchange = await jwtService.signRefreshToken(
            userId
          ); // generate refreshToken and save to Redis

          credentials = {
            token_type: 'Bearer',
            access_token: accessTokenAuthExchange,
            refresh_token: refreshTokenAuthExchange,
            expires_in: 3600, // Google rule
          };

          console.log('\n\n Handle authorization_code SUCCESS!');
          res.status(200).send(credentials);

          break;
        }
        case 'refresh_token': {
          /* Exchange refresh tokens for access tokens */
          const { refresh_token } = req.body;
          console.log(`refresh_token: ${refresh_token}`);

          if (!refresh_token) {
            console.error(`refresh_token invalid`);
            throw createError.BadRequest(
              `refresh_token invalid: ${refresh_token}`
            );
          }

          // verify refreshToke
          payload = await jwtService.verifyRefreshToken(refresh_token);
          userId = payload.userId;
          const accessTokenRefresh = await jwtService.signAccessToken(userId); // generate accessToken

          credentials = {
            token_type: 'Bearer',
            access_token: accessTokenRefresh,
            expires_in: 3600,
          };
          console.log('---> refresh_token SUCCESS!');
          res.status(200).send(credentials);

          break;
        }
        default:
          console.error(`Invalid request type: ${grant_type}`);
          res.status(400).send({ error: 'invalid_grant' });
          throw createError.BadRequest(`invalid_grant invalid: ${grant_type}`);
      }
    } catch (error) {
      res.status(400).send({ error: 'invalid_grant' });
      next(error);
    }
  },
};

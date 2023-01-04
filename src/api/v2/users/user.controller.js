const createError = require('http-errors');
const util = require('util');
const {
  userRegisterValidate,
  userLoginValidate,
} = require('../helpers/validation.js');
const UserModel = require('./user.model');
const jwtService = require('../helpers/jwtService.js');
const redisDb = require('../database/redisDb');

module.exports = {
  register: async (req, res, next) => {
    try {
      console.log(`register email: ${req.body.email}`);
      console.log(`register password: ${req.body.password}`);

      /*
            register request body:       
            {
                email: ""
                password: ""
            } 
            */

      // Validate input email, password
      const { email, password } = req.body;
      const { error } = userRegisterValidate(req.body);

      if (error) {
        throw createError(error.details[0].message);
      }

      // find email in database to check email register Exist
      const isExist = await UserModel.findOne({
        email,
      });

      if (isExist) {
        throw createError.Conflict(`${email} Exist!!!`);
      }

      const user = new UserModel({
        email,
        password,
      });

      const savedUser = await user.save();

      res.json({
        status: 'ok',
        element: savedUser,
      });
    } catch (error) {
      next(error);
    }
  },

  /*
   *Handle User login GET
   */
  loginGet: async (req, res, next) => {
    console.log('\n\n\n---------->>>>>>>>>> LOGIN GET <<<<<<<<<<----------');
    console.log(
      'loginPost query: ',
      util.inspect(req.query, false, null, true)
    );

    res.send(`<!DOCTYPE html>
        <html lang="en">
          <head>
          <title>Example Login Form</title>
          </head>
          <body>
          <form action="/v2/user/login" method="post">
              <!-- user input-->
              Email:<br>
              <input type="email" name="email" placeholder="Email" required><br><br>
              Password:<br>
              <input type="password" name="password" placeholder="Password" required><br><br>
              <input type="hidden" name="redirect_uri" value="${req.query.redirect_uri}" />
              <input type="hidden" name="state" value="${req.query.state}" />
              <!-- submit button -->
              <input type="submit" value="login">
          </form>
          </body>
        </html>`);
  },

  /*
   *Handle User login
   */
  loginPost: async (req, res, next) => {
    console.log('\n\n\n---------->>>>>>>>>> LOGIN POST <<<<<<<<<<----------');
    console.log('   email: ', req.body.email);
    console.log('   password: ', req.body.password);
    console.log('   redirect_uri: ', req.body.redirect_uri);
    console.log('   state: ', req.body.state);

    try {
      // Valitade login request query
      // eslint-disable-next-line camelcase
      const { redirect_uri, state } = req.body;
      // eslint-disable-next-line camelcase
      if (!redirect_uri || !state) {
        throw createError.BadRequest();
      }

      // Validate input login
      const { error } = userLoginValidate(req.body);
      if (error) {
        throw createError(error.details[0].message);
      }

      const { email, password } = req.body;

      // Check email login exist
      const user = await UserModel.findOne({
        email,
      });

      console.log(
        '\n\n User data in Database: ',
        util.inspect(user, false, null, true)
      );

      if (!user) {
        throw createError.NotFound('User has not been register');
      }

      // Check password if email exist
      const isPwdValid = await user.isCheckPassword(password);
      if (!isPwdValid) {
        throw createError.Unauthorized();
      }

      // Genarate Authorization Code
      const authorizationCode = await jwtService.signAuthorizationCode(
        user._id
      );

      /**
       *  After verify user data and gen authorization code, Redirect to Google
       *  Form redirect: https://oauth-redirect.googleusercontent.com/r/YOUR_PROJECT_ID?code=AUTHORIZATION_CODE&state=STATE_STRING
       * */
      // eslint-disable-next-line camelcase
      const responseUrl = `${redirect_uri}?code=${authorizationCode}&state=${state}`;
      console.log('\n\n redirect to GOOLE ---> responseUrl: ', responseUrl);
      return res.redirect(responseUrl);
    } catch (error) {
      next(error);
    }
  },

  refreshToken: async (req, res, next) => {
    /*
            refreshToken request body:       
            {
                "refreshToken" : ""
            } 
    */

    try {
      console.log('refreshToken: ', req.body);

      const { refreshToken } = req.body;

      if (!refreshToken) {
        throw createError.BadRequest();
      }

      const { userId } = await jwtService.verifyRefreshToken(refreshToken);
      const accessTokenReturn = await jwtService.signAccessToken(userId);
      const refreshTokenReturn = await jwtService.signRefreshToken(userId);

      res.json({
        accessTokenReturn,
        refreshTokenReturn,
      });
    } catch (error) {
      next(error);
    }
  },

  logout: async (req, res, next) => {
    try {
      /*
            logout request body:       
            {
                "refreshToken" : ""
            } 
            */

      // Verify refreshToken
      const { refreshToken } = req.body;
      if (!refreshToken) {
        throw createError.BadRequest();
      }

      const { userId } = await await jwtService.verifyRefreshToken(
        refreshToken
      );

      // remove refreshToken from Database(Redis) by key userId
      redisDb
        .del(userId.toString())
        .then((result) => {
          console.log('redisDb.del: ', result);
          res.json({
            message: 'Logout SUCCESS!!!',
          });
        })
        .catch((err) => {
          throw createError.InternalServerError();
        });
    } catch (error) {
      next(error);
    }
  },
};

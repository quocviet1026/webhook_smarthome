const joi = require('joi');

const userLoginValidate = (data) => {
  const userRegisterValidateSchema = joi.object({
    email: joi
      .string()
      // eslint-disable-next-line prefer-regex-literals
      .pattern(new RegExp('gmail.com$'))
      .email()
      .lowercase()
      .required(),
    password: joi.string().min(4).max(32).required(),
    redirect_uri: joi.string().min(4).required(),
    state: joi.string().min(4).required(),
  });

  return userRegisterValidateSchema.validate(data);
};

const userRegisterValidate = (data) => {
  const userRegisterValidateSchema = joi.object({
    email: joi
      .string()
      // eslint-disable-next-line prefer-regex-literals
      .pattern(new RegExp('gmail.com$'))
      .email()
      .lowercase()
      .required(),
    password: joi.string().min(4).max(32).required(),
  });

  return userRegisterValidateSchema.validate(data);
};

module.exports = {
  userRegisterValidate,
  userLoginValidate,
};

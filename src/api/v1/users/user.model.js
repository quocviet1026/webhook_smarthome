const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;
const mongoDb = require('../database/mongoDb');

const UserSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
    unique: true,
    require: true,
  },

  password: {
    type: String,
    require: true,
  },
});

// Middleware Pre handle input befor save to database: hash password before save
UserSchema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(this.password, salt);
    this.password = passwordHash;
  } catch (error) {
    next(error);
  }
});

// Middleware Compare password
UserSchema.methods.isCheckPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    // eslint-disable-next-line no-undef
    next(error);
  }
};

module.exports = mongoDb.model('user', UserSchema);

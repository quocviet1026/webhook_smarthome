const mongoose = require('mongoose');

// eslint-disable-next-line no-unused-vars
const { Schema } = mongoose;
const mongoDb = require('../../../database/mongoDb');

const DeviceSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    required: true,
  },
  connectType: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  gatewayId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  online: {
    type: Boolean,
    required: true,
    default: true,
  },
});

module.exports = mongoDb.model('device', DeviceSchema);

const mongoose = require('mongoose');

// eslint-disable-next-line no-unused-vars
const { Schema } = mongoose;
const mongoDb = require('../../../database/mongoDb');

const DeviceSchema = new mongoose.Schema({
  deviceEUI: {
    type: String,
    required: true,
    unique: true,
  },
  deviceID: {
    type: String,
    required: true,
  },
  deviceType: {
    type: String,
    required: true,
  },
  connectivityType: {
    type: String,
    required: true,
  },
  deviceName: {
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
  attributes: {},
});

module.exports = mongoDb.model('device', DeviceSchema);

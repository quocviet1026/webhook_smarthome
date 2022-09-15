class Device {
  deviceEUI;

  deviceID;

  deviceName;

  deviceType;

  connectivityType;

  gatewayId;

  userId;

  constructor(data) {
    this.deviceEUI = data.deviceEUI;
    this.deviceID = data.deviceID;
    this.deviceName = data.deviceName;
    this.deviceType = data.deviceType;
    this.connectivityType = data.connectivityType;
    this.gatewayId = data.gatewayId;
    this.userId = data.userId;
  }
}

module.exports = Device;

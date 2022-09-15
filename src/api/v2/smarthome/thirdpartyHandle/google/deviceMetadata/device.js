class Device {
  id;

  name;

  gatewayId;

  userId;

  constructor(data) {
    this.id = data.deviceEUI;
    this.name = data.deviceName;
    this.gatewayId = data.gatewayId;
    this.userId = data.userId;
  }
}

module.exports = Device;

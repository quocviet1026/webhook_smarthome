class Device {
  id;

  name;

  gatewayId;

  userId;

  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.gatewayId = data.gatewayId;
    this.userId = data.userId;
  }
}

module.exports = Device;

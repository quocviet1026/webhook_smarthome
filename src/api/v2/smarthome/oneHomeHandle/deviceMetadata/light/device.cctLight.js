const Device = require('../device');

class CctLight extends Device {
  #deviceType = 'cctLight';

  #attributes = {
    on: false,
    brightness: 50,
    color: {
      temperatureK: 3000,
    },
  };

  get metadata() {
    return {
      deviceEUI: this.deviceEUI,
      deviceID: this.deviceID,
      deviceName: this.deviceName,
      deviceType: this.#deviceType,
      connectivityType: this.connectivityType,
      gatewayId: this.gatewayId,
      userId: this.userId,
      attributes: this.#attributes,
    };
  }
}

module.exports = CctLight;

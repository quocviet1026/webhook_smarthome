const Device = require('../device');

class RgbCctLight extends Device {
  #deviceType = 'rgbCctLight';

  #attributes = {
    on: false,
    brightness: 50,
    color: {
      temperatureK: 3000,
      spectrumRgb: 16777215,
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

module.exports = RgbCctLight;

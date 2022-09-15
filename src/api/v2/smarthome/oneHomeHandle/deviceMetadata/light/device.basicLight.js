const Device = require('../device');

class BasicLight extends Device {
  #deviceType = 'basicLight';
  #attributes = {
    on: false,
  };

  get metadata() {
      return {
        deviceEUI: this.deviceEUI,
        deviceID: this.deviceID,
        deviceName: this.deviceName,
        deviceType: this.#deviceType,
        connectivityType : this.connectivityType,
        gatewayId: this.gatewayId,
        userId : this.userId,
        attributes: this.#attributes,
    }
  }
}

module.exports = BasicLight;

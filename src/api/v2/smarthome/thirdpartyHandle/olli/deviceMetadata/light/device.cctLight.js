const Device = require('../device');

class CctLight extends Device {
  #type = 'action.devices.types.LIGHT';

  #traits = [
    'action.devices.traits.OnOff',
    'action.devices.traits.Brightness',
    'action.devices.traits.ColorTemperature',
  ];

  #attributes = {
    colorModel: 'rgb',
    colorTemperatureRange: {
      temperatureMinK: 2000,
      temperatureMaxK: 6500,
    },
  };

  get metadata() {
    return {
      id: this.id,
      type: this.#type,
      traits: this.#traits,
      name: {
        name: this.name,
      },
      willReportState: true,
      attributes: this.#attributes,
      customData: {
        gatewayId: this.gatewayId,
        user: this.userId,
      },
    };
  }
}

module.exports = CctLight;

const Device = require('../device');

class BasicSwitch extends Device {
  #type = 'action.devices.types.SWITCH';

  #traits = ['action.devices.traits.OnOff'];

  get metadata() {
    return {
      id: this.id,
      type: this.#type,
      traits: this.#traits,
      name: {
        name: this.name,
      },
      willReportState: true,
      customData: {
        gatewayId: this.gatewayId,
        user: this.userId,
      },
    };
  }
}

module.exports = BasicSwitch;

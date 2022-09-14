const Device = require('../device');

class SmokeSensor extends Device {
  #type = 'action.devices.types.SENSOR';

  #traits = ['action.devices.traits.SensorState'];

  #attributes = {
    sensorStatesSupported: [
      {
        name: 'SmokeLevel',
        numericCapabilities: {
          rawValueUnit: 'PARTS_PER_MILLION',
        },
        descriptiveCapabilities: {
          availableStates: ['smoke detected', 'no smoke detected'],
        },
      },
    ],
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

module.exports = SmokeSensor;

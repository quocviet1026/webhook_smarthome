const Device = require('../device');

class TempHumiSensor extends Device {
  #type = 'action.devices.types.SENSOR';

  #traits = [
    'action.devices.traits.TemperatureControl',
    'action.devices.traits.HumiditySetting',
  ];

  #attributes = {
    temperatureRange: {
      minThresholdCelsius: 0,
      maxThresholdCelsius: 50,
    },
    temperatureStepCelsius: 0.5,
    temperatureUnitForUX: 'C',
    queryOnlyTemperatureControl: true,
    humiditySetpointRange: {
      minPercent: 0,
      maxPercent: 100,
    },
    queryOnlyHumiditySetting: true,
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

module.exports = TempHumiSensor;

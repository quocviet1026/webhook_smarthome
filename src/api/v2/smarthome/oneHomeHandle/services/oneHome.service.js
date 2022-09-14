const DeviceModel = require('../models/device.model');
const redisService = require('../../../helpers/redisService');
const mqttClient = require('../routes/oneHome.route');

const {
  requestSync,
  notifications,
  reportState,
} = require('../../thirdpartyHandle/google/fulfillment/fulfillment.service');

module.exports = {
  addDevice: async (deviceObject) => {
    console.log('\n\n--->addDevice, deviceObject: ', deviceObject);
    // Save Device to Database
    const newDevice = new DeviceModel(deviceObject);
    const savedUser = newDevice
      .save()
      .then((result) => {
        console.log(`save data success: ${result}`);
      })
      .catch((err) => {
        console.log(`save data error: ${err}`);
      });
    // Save key to redis ---> id(deviceId) : gatewayId
    await redisService.setKey(deviceObject.id, deviceObject.gatewayId);
    // Call RequestSync to Google Home Cloud
    await requestSync(deviceObject.userId);
  },
  removeDevice: async (deviceObject) => {
    console.log('\n\n--->removeDevice, deviceObject: ', deviceObject);
    // Find and Remove From Database
    DeviceModel.findOneAndDelete({ id: deviceObject.id }, (err, docs) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Deleted Device : ', docs);
      }
    });

    // Remove key(deviceId) from Redis
    await redisService.delKey(deviceObject.id, deviceObject.gatewayId);
    // Call RequestSync to Google Home Cloud
    await requestSync(deviceObject.userId);
  },

  updateTrait: (deviceObject) => {
    console.log('\n\n--->updateTrait, deviceObject: ', deviceObject);

    //For test
    const userId  = '631710a2da842ecd127d5320';
    const deviceId = 'smoke_0x0001';
    const deviceNotiObj = {
      SensorState : {
        priority : 0,
        name : 'SmokeLevel',
        currentSensorState :  'smoke detected'
      }
    }

    const deviceReportObj = {
      currentSensorStateData : {
        priority : 0,
        name : 'SmokeLevel',
        currentSensorState :  'smoke detected'
      }
    }

    // notifications(userId, deviceId, deviceNotiObj);
    reportState(userId, deviceId, deviceReportObj);
  },

  controlDevice: () => {},

  sendMessageToGateway: (message, topic) => {
    console.log(
      `\n\n--->sendMessageToGateway --- topic: ${topic}, message: ${message} `
    );
    try {
      mqttClient.publish(topic, JSON.stringify(message), { qos: 0 }, (e) => {
        console.log('sendMessageToGateway ERROR: ', e);
      });
    } catch (e) {
      console.log('sendMessageToGateway ERROR: ', e);
    }
  },
};

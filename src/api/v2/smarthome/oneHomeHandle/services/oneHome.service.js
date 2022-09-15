const DeviceModel = require('../models/device.model');
const redisService = require('../../../helpers/redisService');
const mqttClient = require('../routes/oneHome.route');

const {createDeviceEUI} = require('../util/convertEuiDevice');
const {makeKeyGatewayId, makeKeyDeviceId} = require('../util/makeKeyRedis');
const deviceFactory = require('../deviceMetadata/device.factory');

const {
  requestSync,
  notifications,
  reportState,
} = require('../../thirdpartyHandle/google/fulfillment/fulfillment.service');

module.exports = {
  addDevice: async (deviceObject) => {
    // console.group('oneHomeHandle addDevice');
    console.log('\n\n--->oneHomeHandle addDevice, deviceObject: ', deviceObject);
    // // Save Device to Database
    // const newDevice = new DeviceModel(deviceObject);
    // const savedUser = newDevice
    //   .save()
    //   .then((result) => {
    //     console.log(`save data success: ${result}`);
    //   })
    //   .catch((err) => {
    //     console.log(`save data error: ${err}`);
    //   });
    // // Save key to redis ---> id(deviceId) : gatewayId
    // await redisService.setKey(deviceObject.deviceEUI, deviceObject.gatewayId);
    // // Call RequestSync to Google Home Cloud
    // await requestSync(deviceObject.userId);
    try {
      const arrChild = deviceObject.child;
      const deviceEUI = deviceObject.deviceEUI;
      const arrayEUI = createDeviceEUI(deviceEUI, arrChild);
      const arrDeviceObjAddDb = arrayEUI.map(eui => {
        deviceObject.deviceEUI = eui;
        return deviceFactory.createDevice(deviceObject).metadata;
      });
      console.log('arrDeviceObjAddDb: ',arrDeviceObjAddDb);

      DeviceModel.insertMany(arrDeviceObjAddDb).then(async function(data){
        console.log('Add new device to Database Success: ', data);
      // Save key to redis
      // deviceEUI_gatewayID : gatewayId
      await redisService.setKey(makeKeyGatewayId(deviceObject.deviceEUI), deviceObject.gatewayId);
      // deviceEUI_deviceID : deviceID
      await redisService.setKey(makeKeyDeviceId(deviceObject.deviceEUI), deviceObject.deviceID);

      await requestSync(deviceObject.userId);
      }).catch(function(error){
        console.log('Add new device to Database Error: ', error);
        return error;
      });
    } catch (error) {
      console.log('oneHomeHandle addDevice ERROR: ', error);
    } 
  },
  removeDevice: async (deviceObject) => {
    console.log('\n\n--->removeDevice, deviceObject: ', deviceObject);
    // Find and Remove From Database
    DeviceModel.findOneAndDelete({ deviceEUI: deviceObject.deviceEUI }, (err, docs) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Deleted Device : ', docs);
      }
    });

    // Remove key(deviceId) from Redis
    await redisService.delKey(deviceObject.deviceEUI);
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

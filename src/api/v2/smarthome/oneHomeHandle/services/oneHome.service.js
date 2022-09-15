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
    try {
      console.log('\n\n--->removeDevice, deviceObject: ', deviceObject);
      // Find and Remove From Database
      const deviceEUIregex = `${deviceObject.deviceEUI}`;

      const arrListDeviceRemove = await DeviceModel.find({ deviceEUI: {$regex:deviceEUIregex}});
      console.log('arrListDeviceRemove: ', arrListDeviceRemove);

      const listKeyGatewayId = arrListDeviceRemove.map(deviceObj => {
        return makeKeyGatewayId(deviceObj.deviceEUI);
      });
      console.log('listKeyGatewayId: ', listKeyGatewayId);

      const listKeyDeviceId = arrListDeviceRemove.map(deviceObj => {
        return makeKeyDeviceId(deviceObj.deviceEUI);
      });
      console.log('listKeyDeviceId: ', listKeyDeviceId);

      listKeyGatewayId.forEach(key => {
        redisService.delKey(key);
      });

      listKeyDeviceId.forEach(key => {
        redisService.delKey(key);
      });

      await DeviceModel.deleteMany({ deviceEUI: {$regex:deviceEUIregex}});

      // Call RequestSync to Google Home Cloud
      await requestSync(deviceObject.userId);
    } catch (error) {
      console.log('oneHomeHandle removeDevice ERROR: ', error);
    }
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

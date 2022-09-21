const DeviceModel = require('../models/device.model');
const redisService = require('../../../helpers/redisService');
const {
  makeKeyGatewayId,
  makeKeyDeviceId,
  makeKeyUserId,
} = require('./makeKeyRedis');
const {createRawDeviceEUI} = require('./convertEuiDevice');
const { createMixDeviceEUI } = require('./convertEuiDevice');
const {
  requestSync,
  notifications,
  reportState,
} = require('../../thirdpartyHandle/google/fulfillment/fulfillment.service');

const serviceUpdateTrait = {
  updateTraitOnOff: async (deviceEuiInDB, value) => {
    try {
      console.group('updateTraitOnOff');
      let valueUpdate = true;
      if((value === '0') || (value === 0)) {
        valueUpdate = false;
      }
      const fillter = { deviceEUI : deviceEuiInDB };
      console.log('fillter: ', fillter);
      const update = { 'attributes.on': valueUpdate };
      const option = { new: true };
      const dataUpdated = await DeviceModel.findOneAndUpdate(
        fillter,
        { $set: update },
        option
      );

      const deviceReportObj = {
        on: valueUpdate,
      };

      const rawDeviceEUI = createRawDeviceEUI(deviceEuiInDB);
      console.log('rawDeviceEUI: ', rawDeviceEUI);

      const keyToGetUserId = makeKeyUserId(rawDeviceEUI);
      console.log('keyToGetUserId: ', keyToGetUserId);

      const userId = await redisService.getKey(keyToGetUserId);
      console.log('userId: ', userId);


      reportState(userId, deviceEuiInDB, deviceReportObj);
      console.groupEnd('updateTraitOnOff');
      return dataUpdated;
    } catch (error) {
      console.log('updateTraitOnOff ERROR: ', error);
      dataUpdated = undefined;
      return dataUpdated;
    }
  },

  updateTraitBrightness: async (deviceEuiInDB, value) => {
    try {
      const fillter = { deviceEuiInDB };
      const update = { 'attributes.brightness': value };
      const option = { new: true };
      const dataUpdated = await DeviceModel.findOneAndUpdate(
        fillter,
        { $set: update },
        option
      );
      return dataUpdated;
    } catch (error) {
      console.log('updateTraitBrightness ERROR: ', error);
      dataUpdated = undefined;
      return dataUpdated;
    }
  },

  updateTraitTempColor: async (deviceEuiInDB, value) => {
    try {
      const fillter = { deviceEuiInDB };
      const update = { 'attributes.color.temperatureK': value };
      const option = { new: true };
      const dataUpdated = await DeviceModel.findOneAndUpdate(
        fillter,
        { $set: update },
        option
      );
      return dataUpdated;
    } catch (error) {
      console.log('updateTraitTempColor ERROR: ', error);
      dataUpdated = undefined;
      return dataUpdated;
    }
  },

  updateTraitColor: async (deviceEuiInDB, value) => {
    // const fillter = {deviceEuiInDB};
    // const update = {"attributes.color.temperatureK" : value};
    // const option = {new : true};
    // const dataUpdated =  await DeviceModel.findOneAndUpdate(fillter, {$set: update}, option);
    // return dataUpdated;
  },
};

module.exports = {
  updateDeviceTrait: async (objDataDevice) => {
    const { deviceEUI, child, strait, value } = objDataDevice;
    console.log('updateDeviceTrait, deviceEUI: ', deviceEUI);
    const deviceEuiInDB = createMixDeviceEUI(deviceEUI, child);
    console.log('updateDeviceTrait, deviceEuiInDB: ', deviceEuiInDB);
    let dataReturn;
    switch (strait) {
      case 'traitOnOff':
        dataReturn = await serviceUpdateTrait.updateTraitOnOff(
          deviceEuiInDB,
          value
        );
        return dataReturn;
      case 'traitBrightness':
        dataReturn = await serviceUpdateTrait.updateTraitBrightness(
          deviceEuiInDB,
          value
        );
        return dataReturn;
      case 'traitTempColor':
        dataReturn = await serviceUpdateTrait.updateTraitTempColor(
          deviceEuiInDB,
          value
        );
        return dataReturn;
      case 'traitColor':
        dataReturn = await serviceUpdateTrait.updateTraitColor(
          deviceEuiInDB,
          value
        );
        return dataReturn;
      default:
        console.log('updateDeviceTrait ERROR, not support trait: ', strait);
        dataReturn = undefined;
        return dataReturn;
    }
  },
};

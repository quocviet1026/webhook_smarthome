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
const {rgbToDec} = require('./convertColor');

const serviceUpdateTrait = {
  updateTraitOnOff: async (deviceEuiInDB, value) => {
    try {
      console.log('updateTraitOnOff');
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
      console.log('updateTraitOnOff SUCCESS');
      return dataUpdated;
    } catch (error) {
      console.log('updateTraitOnOff ERROR: ', error);
      dataUpdated = undefined;
      return dataUpdated;
    }
  },

  updateTraitBrightness: async (deviceEuiInDB, value) => {
    try {
      console.log('updateTraitBrightness');
      let valueUpdate = parseInt(value);
      const fillter = { deviceEUI : deviceEuiInDB };
      console.log('fillter: ', fillter);
      const update =  { 'attributes.brightness': valueUpdate };
      const option = { new: true };
      const dataUpdated = await DeviceModel.findOneAndUpdate(
        fillter,
        { $set: update },
        option
      );

      const deviceReportObj = {
        brightness: valueUpdate,
      };

      const rawDeviceEUI = createRawDeviceEUI(deviceEuiInDB);
      console.log('rawDeviceEUI: ', rawDeviceEUI);

      const keyToGetUserId = makeKeyUserId(rawDeviceEUI);
      console.log('keyToGetUserId: ', keyToGetUserId);

      const userId = await redisService.getKey(keyToGetUserId);
      console.log('userId: ', userId);

      reportState(userId, deviceEuiInDB, deviceReportObj);
      console.log('updateTraitBrightness SUCCESS');
      return dataUpdated;
    } catch (error) {
        console.log('updateTraitBrightness ERROR: ', error);
      dataUpdated = undefined;
      return dataUpdated;
    }
  },

  updateTraitTempColor: async (deviceEuiInDB, value) => {
    try {
      console.log('updateTraitTempColor: ', value);
      let valueUpdate = parseInt(value);
      const fillter = { deviceEUI : deviceEuiInDB };
      console.log('fillter: ', fillter);
      const update =  { 'attributes.color.temperatureK': valueUpdate };
      const option = { new: true };
      const dataUpdated = await DeviceModel.findOneAndUpdate(
        fillter,
        { $set: update },
        option
      );

      const deviceReportObj = {
        color: {
            temperatureK : valueUpdate
        },
      };

      const rawDeviceEUI = createRawDeviceEUI(deviceEuiInDB);
      console.log('rawDeviceEUI: ', rawDeviceEUI);

      const keyToGetUserId = makeKeyUserId(rawDeviceEUI);
      console.log('keyToGetUserId: ', keyToGetUserId);

      const userId = await redisService.getKey(keyToGetUserId);
      console.log('userId: ', userId);

      reportState(userId, deviceEuiInDB, deviceReportObj);
      console.log('updateTraitTempColor SUCCESS');
      return dataUpdated;
    } catch (error) {
        console.log('updateTraitTempColor ERROR: ', error);
      dataUpdated = undefined;
      return dataUpdated;
    }
  },

  updateTraitColor: async (deviceEuiInDB, value) => {  //value : "R, G, B"
    try {
        console.log('updateTraitColor: ', value);
        const rgbArray = value.split(',');
        let valueUpdateInt = rgbToDec(parseInt(rgbArray[0]),parseInt(rgbArray[1]),parseInt(rgbArray[2]));
        const fillter = { deviceEUI : deviceEuiInDB };
        console.log('fillter: ', fillter);
        const update =  { 'attributes.color.spectrumRgb': valueUpdateInt };
        const option = { new: true };
        const dataUpdated = await DeviceModel.findOneAndUpdate(
        fillter,
        { $set: update },
        option
        );

        const deviceReportObj = {
            color: {
                spectrumRgb : valueUpdateInt
            },
        };

        const rawDeviceEUI = createRawDeviceEUI(deviceEuiInDB);
        console.log('rawDeviceEUI: ', rawDeviceEUI);

        const keyToGetUserId = makeKeyUserId(rawDeviceEUI);
        console.log('keyToGetUserId: ', keyToGetUserId);

        const userId = await redisService.getKey(keyToGetUserId);
        console.log('userId: ', userId);

        reportState(userId, deviceEuiInDB, deviceReportObj);
        console.log('updateTraitColor SUCCESS');
        return dataUpdated;
    } catch (error) {
        console.log('updateTraitColor ERROR: ', error);
        dataUpdated = undefined;
        return dataUpdated;
    }
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

const util = require('util');
const { GoogleAuth } = require('google-auth-library');
const { google } = require('googleapis');

const homegraph = google.homegraph('v1');
const path = require('path');
// const { uuid } = require('uuidv4');
const { v4: uuidv4 } = require('uuid')

const redisService = require('../../../../helpers/redisService');
const DeviceModel = require('../../../oneHomeHandle/models/device.model');

let initGoogleAuth;
let authClient;
(initGoogleAuth =  async () => {
  const auth = new GoogleAuth({
    // Scopes can be specified either as an array or as a single, space-delimited string.
    keyFilename: path
      .join(__dirname, 'onehomedemo-c45ee11ec83b.json')
      .toString(),
    scopes: ['https://www.googleapis.com/auth/homegraph'],
  });
  // Acquire an auth client, and bind it to all future calls
  authClient = await auth.getClient();
  google.options({ auth: authClient });
})();


module.exports = {
  getGatewayIdOfDeviceId: async (listDeviceId) => {
    // console.log('---listDeviceId: ', listDeviceId);
    const listGatewayIdPromise = listDeviceId.map((ObjDevice) =>
      redisService.getKey(ObjDevice.id)
    );
    const listGatewayId = await Promise.all(listGatewayIdPromise);

    return listGatewayId;
  },

  convertGooglecommandToTrait: (execution) => {
    switch (execution.command) {
      case 'action.devices.commands.OnOff':
        return {
          traitName: 'traitOnOff',
          value: execution.params.on ? 'On' : 'Off',
        };
      case 'action.devices.commands.BrightnessAbsolute':
        return {
          traitName: 'traitBrightness',
          value: execution.params.color.brightness,
        };
      case 'action.devices.commands.ColorAbsolute':
        if (execution.params.color.temperature) {
          return {
            traitName: 'traitTempColor',
            value: execution.params.color.temperature,
          };
        }
        if (execution.params.color.spectrumRGB) {
          return {
            traitName: 'traitColor',
            value: execution.params.color.spectrumRGB,
          };
        }
        break;
      default:
        return undefined;
    }
  },

  controlRealDevice: async (objDeviceInfo) => {
    console.group('controlRealDevice');
    console.log('objDeviceInfo: ', objDeviceInfo);

    console.groupEnd('controlRealDevice');
  },

  getDataDevice: (deviceId) =>
    new Promise((resolve, reject) => {
      DeviceModel.findOne({ id: deviceId })
        .then((data) => resolve(data))
        .catch((error) => reject(error));
    }),

  getDataDevices: async (listDeviceEUI) => {
    console.log('---listDeviceEUI: ', listDeviceEUI);
    const listDeviceDataPromise = listDeviceEUI.map((ObjDevice) =>
      // console.log('getDataDevices---ObjDevice: ', ObjDevice);
      DeviceModel.findOne({ deviceEUI: ObjDevice.id })
    );
    const listDataDevice = await Promise.all(listDeviceDataPromise);

    return listDataDevice;
  },

  requestSync: async (userId) => {
    console.log(`---> RequestSync: ${userId}`);
    try {

      google.options({ auth: authClient });

      const res = await homegraph.devices.requestSync({
        // Request body metadata
        requestBody: {
          agentUserId: userId,
          async: false,
        },
      });
      console.info(`Request sync ${userId} SUCCESS: ${res}`);
    } catch (err) {
      console.info('Request sync response ERROR: ', err);
    }
  },

  reportState: async (userId, deviceId, objDataUpdate) => {
    console.log(`---> reportState: ${userId},  ${deviceId},  ${objDataUpdate}`);
    try {

      const requestBody = {};
      requestBody.requestBody = {};
      requestBody.requestBody.agentUserId = userId;
      requestBody.requestBody.requestId = uuidv4();
      requestBody.requestBody.payload = {};
      requestBody.requestBody.payload.devices = {};
      requestBody.requestBody.payload.devices.states = {};
      requestBody.requestBody.payload.devices.states[deviceId] = objDataUpdate;

      console.log('\n\n requestBody: ', util.inspect(requestBody,false, null, true));

      const res = await homegraph.devices.reportStateAndNotification(
        requestBody
      );
      console.info(`reportState ${userId} SUCCESS: ${res}`);
    } catch (err) {
      console.info('reportState response ERROR: ', err);
    }
  },

  notifications : async (userId, deviceId, objDataUpdate) => {
    console.log('---> notifications: ', userId, deviceId, objDataUpdate);
    try {
      const requestBody = {};
      requestBody.requestBody = {};
      requestBody.requestBody.agentUserId = userId;
      requestBody.requestBody.eventId = uuidv4();
      requestBody.requestBody.requestId = uuidv4();
      requestBody.requestBody.payload = {};
      requestBody.requestBody.payload.devices = {};
      requestBody.requestBody.payload.devices.notifications = {};
      requestBody.requestBody.payload.devices.notifications[deviceId] = objDataUpdate;

      console.log('\n\requestBody: ', util.inspect(requestBody,false, null, true));

      const res = await homegraph.devices.reportStateAndNotification(
        requestBody
      );
      console.info(`notifications ${userId} SUCCESS: ${res}`);
    } catch (err) {
      console.info('notifications response ERROR: ', err);
    }
  }
};

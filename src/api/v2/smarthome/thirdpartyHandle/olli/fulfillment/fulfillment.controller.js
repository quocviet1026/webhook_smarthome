const { smarthome } = require('actions-on-google');
const DeviceModel = require('../../../oneHomeHandle/models/device.model');
const deviceFactory = require('../deviceMetadata/device.factory');
const { validateCredentials } = require('../../../../helpers/jwtService');
const {
  getGatewayIdOfDeviceId,
  convertGoogleCommandToOneHomeTrait,
  getDataDevices,
} = require('./fulfillment.service');

const fulfillment = smarthome();

fulfillment.onSync(async (body, headers) => {
  try {
    console.group('onSync');
    //   const { userId } = req.payload;
    const { userId } = await validateCredentials(headers);
    console.log(`userId: ${userId}`);

    const listDevice = await DeviceModel.find({
      userId,
    });

    console.log(`listDevice: ${listDevice}`);

    const deviceListSync = listDevice.map(
      (deviceData) => deviceFactory.createDevice(deviceData).metadata
    );

    console.log('----------deviceListSync: ', deviceListSync);
    console.group('onSync');
    return {
      requestId: body.requestId,
      payload: {
        agentUserId: userId,
        devices: deviceListSync,
      },
    };
  } catch (error) {
    return {
      requestId: body.requestId,
      payload: {
        errorCode: 'authFailure',
        debugString: error.toString(),
      },
    };
  }
});

fulfillment.onExecute(async (body, headers) => {
  try {
    console.group('onExecute');
    //   console.log('request: ', req.body);
    const { userId } = await validateCredentials(headers);
    console.log(`userId: ${userId}`);
    // const command = body.inputs[0].payload.commands[0];
    const command = body.inputs[0].payload.commands[0];
    console.log('command: ', command);
    // Get list devices, list command execute from Google Request:
    const { devices, execution } = command;
    // Get list Gateway ID of list device
    const listGatewayId = await getGatewayIdOfDeviceId(devices);
    console.log('listGatewayId: ', listGatewayId);
    // add data Gateway id to list Device request
    devices.forEach((device, index) => {
      device.gatewayId = listGatewayId[index];
    });
    console.log('devices request: ', devices);

    console.log('execution: ', execution);
    const executionConvert = execution.map(convertGoogleCommandToOneHomeTrait);

    console.log(
      '\n\n-----------------------> executionConvert: ',
      executionConvert
    );

    console.groupEnd('onExecute');
    return {
      requestId: body.requestId,
      payload: {
        commands: [
          {
            ids: command.devices.map((device) => device.id),
            status: 'PENDING',
          },
        ],
      },
    };
  } catch (error) {
    return {
      requestId: body.requestId,
      payload: {
        errorCode: 'authFailure',
        debugString: error.toString(),
      },
    };
  }
});

fulfillment.onQuery(async (body, headers) => {
  try {
    console.group('onQuery');
    const { userId } = await validateCredentials(headers);
    console.log(`userId: ${userId}`);
    const { devices } = body.inputs[0].payload;
    console.log('array devices request: ', devices);
    const listDataDevice = await getDataDevices(devices);
    console.log('listDataDevice: ', listDataDevice);
    const objDeviceResponse = {};
    listDataDevice.forEach((device) => {
      objDeviceResponse[device.id] = {
        online: device.online,
        status: 'SUCCESS',
      };
    });
    console.log('objDeviceResponse: ', objDeviceResponse);
    console.groupEnd('onQuery');
    return {
      requestId: body.requestId,
      payload: {
        devices: objDeviceResponse,
      },
    };
  } catch (error) {
    return {
      requestId: body.requestId,
      payload: {
        errorCode: 'authFailure',
        debugString: error.toString(),
      },
    };
  }
});

fulfillment.onDisconnect(async (body, headers) => {
  try {
    console.group('onDisconnect');
    const { userId } = await validateCredentials(headers);
    console.log(`userId: ${userId}`);
    // Clear the user's current refresh token
    console.groupEnd('onDisconnect');
    return {};
  } catch (error) {
    return {
      requestId: body.requestId,
      payload: {
        errorCode: 'authFailure',
        debugString: error.toString(),
      },
    };
  }
});

/**
 * Cloud Function: Handler for Smart Home intents
 */
module.exports = fulfillment;

const { createRawDeviceEUI } = require('./convertEuiDevice');
const { makeKeyDeviceId } = require('./makeKeyRedis');
const { getKey } = require('../../../helpers/redisService');
const { decToRgb } = require('./convertColor');

const serviceControl = {
  controlOnOff: async (arrObjDeviceEuiChild, arrCommandControlConverted) => {
    try {
      const arrPromiseGetDeviceID = arrObjDeviceEuiChild.map(
        (objDeviceEuiChild) =>
          getKey(makeKeyDeviceId(objDeviceEuiChild.deviceEUI))
      );

      const arrDeviceID = await Promise.all(arrPromiseGetDeviceID);
      console.log('arrGetDeviceID: ', arrDeviceID);

      const arrObjCommandReq = arrObjDeviceEuiChild.map((objDeviceEuiChild) =>
        // const deviceID = await getKey(makeKeyDeviceId(objDeviceEuiChild.deviceEUI));
        ({
          deviceEUI: objDeviceEuiChild.deviceEUI,
          deviceID: 'deviceID',
          child: objDeviceEuiChild.child,
          traitName: arrCommandControlConverted[0].traitName,
          value: arrCommandControlConverted[0].value,
        })
      );

      arrDeviceID.forEach((currentValue, index) => {
        arrObjCommandReq[index].deviceID = currentValue;
      });

      console.log(
        '----------> arrObjCommandReq <----------------: ',
        arrObjCommandReq
      );

      const listDeviceResponseCommands = arrObjCommandReq.map((objDevice) => ({
        ids: [objDevice.deviceEUI],
        status: 'SUCCESS',
        states: {
          online: true,
          on: objDevice.value === 'On',
        },
      }));

      console.log(
        '----------> listDeviceResponseCommands: ',
        listDeviceResponseCommands
      );
      return listDeviceResponseCommands;
    } catch (error) {
      return error;
    }
  },

  controlBrightness: async (
    arrObjDeviceEuiChild,
    arrCommandControlConverted
  ) => {
    try {
      const arrPromiseGetDeviceID = arrObjDeviceEuiChild.map(
        (objDeviceEuiChild) =>
          getKey(makeKeyDeviceId(objDeviceEuiChild.deviceEUI))
      );
      const arrDeviceID = await Promise.all(arrPromiseGetDeviceID);
      console.log('arrGetDeviceID: ', arrDeviceID);

      const arrObjCommandReq = arrObjDeviceEuiChild.map((objDeviceEuiChild) =>
        // const deviceID = await getKey(makeKeyDeviceId(objDeviceEuiChild.deviceEUI));
        ({
          deviceEUI: objDeviceEuiChild.deviceEUI,
          deviceID: 'deviceID',
          child: objDeviceEuiChild.child,
          traitName: arrCommandControlConverted[0].traitName,
          value: arrCommandControlConverted[0].value,
        })
      );

      arrDeviceID.forEach((currentValue, index) => {
        arrObjCommandReq[index].deviceID = currentValue;
      });

      console.log(
        '----------> arrObjCommandReq <----------------: ',
        arrObjCommandReq
      );

      const listDeviceResponseCommands = arrObjCommandReq.map((objDevice) => ({
        ids: [objDevice.deviceEUI],
        status: 'SUCCESS',
        states: {
          online: true,
          brightness: parseInt(objDevice.value),
        },
      }));

      console.log(
        '----------> listDeviceResponseCommands: ',
        listDeviceResponseCommands
      );
      return listDeviceResponseCommands;
    } catch (error) {
      return error;
    }
  },

  controlColor: async (arrObjDeviceEuiChild, arrCommandControlConverted) => {
    try {
      const arrPromiseGetDeviceID = arrObjDeviceEuiChild.map(
        (objDeviceEuiChild) =>
          getKey(makeKeyDeviceId(objDeviceEuiChild.deviceEUI))
      );

      const arrDeviceID = await Promise.all(arrPromiseGetDeviceID);
      console.log('arrGetDeviceID: ', arrDeviceID);

      const arrObjCommandReq = arrObjDeviceEuiChild.map((objDeviceEuiChild) =>
        // const deviceID = await getKey(makeKeyDeviceId(objDeviceEuiChild.deviceEUI));
        ({
          deviceEUI: objDeviceEuiChild.deviceEUI,
          deviceID: 'deviceID',
          child: objDeviceEuiChild.child,
          traitName: arrCommandControlConverted[0].traitName,
          value: decToRgb(arrCommandControlConverted[0].value),
        })
      );

      arrDeviceID.forEach((currentValue, index) => {
        arrObjCommandReq[index].deviceID = currentValue;
      });

      console.log(
        '----------> arrObjCommandReq <----------------: ',
        arrObjCommandReq
      );

      const listDeviceResponseCommands = arrObjCommandReq.map((objDevice) => ({
        ids: [objDevice.deviceEUI],
        status: 'SUCCESS',
        states: {
          online: true,
          color: {
            spectrumRGB: arrCommandControlConverted[0].value,
          },
        },
      }));

      console.log(
        '----------> listDeviceResponseCommands: ',
        listDeviceResponseCommands
      );
      return listDeviceResponseCommands;
    } catch (error) {
      return error;
    }
  },

  controlTempColor: async (
    arrObjDeviceEuiChild,
    arrCommandControlConverted
  ) => {
    try {
      const arrPromiseGetDeviceID = arrObjDeviceEuiChild.map(
        (objDeviceEuiChild) =>
          getKey(makeKeyDeviceId(objDeviceEuiChild.deviceEUI))
      );

      const arrDeviceID = await Promise.all(arrPromiseGetDeviceID);
      console.log('arrGetDeviceID: ', arrDeviceID);

      const arrObjCommandReq = arrObjDeviceEuiChild.map((objDeviceEuiChild) =>
        // const deviceID = await getKey(makeKeyDeviceId(objDeviceEuiChild.deviceEUI));
        ({
          deviceEUI: objDeviceEuiChild.deviceEUI,
          deviceID: 'deviceID',
          child: objDeviceEuiChild.child,
          traitName: arrCommandControlConverted[0].traitName,
          value: arrCommandControlConverted[0].value,
        })
      );

      arrDeviceID.forEach((currentValue, index) => {
        arrObjCommandReq[index].deviceID = currentValue;
      });

      console.log(
        '----------> arrObjCommandReq <----------------: ',
        arrObjCommandReq
      );

      const listDeviceResponseCommands = arrObjCommandReq.map((objDevice) => ({
        ids: [objDevice.deviceEUI],
        status: 'SUCCESS',
        states: {
          online: true,
          color: {
            temperatureK: arrCommandControlConverted[0].value,
          },
        },
      }));

      console.log(
        '----------> listDeviceResponseCommands: ',
        listDeviceResponseCommands
      );
      return listDeviceResponseCommands;
    } catch (error) {
      return error;
    }
  },
};

module.exports = {
  controlPhysicalDevice: async (
    arrDeviceEuiInDB,
    arrCommandControlConverted
  ) => {
    console.group('controlDevice');
    const arrObjDeviceEuiAndChild = arrDeviceEuiInDB.map((deviceEUImix) => ({
      deviceEUI: createRawDeviceEUI(deviceEUImix).deviceEUI,
      child: createRawDeviceEUI(deviceEUImix).child,
    }));

    console.log('arrObjDeviceEuiAndChild: ', arrObjDeviceEuiAndChild);

    const { traitName } = arrCommandControlConverted[0];

    let ret;
    switch (traitName) {
      case 'traitOnOff':
        ret = await serviceControl.controlOnOff(
          arrObjDeviceEuiAndChild,
          arrCommandControlConverted
        );
        return ret;
      case 'traitBrightness':
        ret = await serviceControl.controlBrightness(
          arrObjDeviceEuiAndChild,
          arrCommandControlConverted
        );
        return ret;
      case 'traitColor':
        ret = await serviceControl.controlColor(
          arrObjDeviceEuiAndChild,
          arrCommandControlConverted
        );
        return ret;
      default:
        console.log('ERROR, not support traitName: ', traitName);
    }

    console.groupEnd('controlDevice');
  },
};

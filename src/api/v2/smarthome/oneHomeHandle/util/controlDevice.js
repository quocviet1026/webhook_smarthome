const {createRawDeviceEUI} = require('./convertEuiDevice');
const {makeKeyDeviceId} = require('./makeKeyRedis');
const {getKey} = require('../../../helpers/redisService');
const {decToRgb} = require('./convertColor');

const serviceControl = {
    controlOnOff : async (arrObjDeviceEuiChild, arrCommandControlConverted) => {
        try {
            const arrPromiseGetDeviceID = arrObjDeviceEuiChild.map((objDeviceEuiChild) => {
                return getKey(makeKeyDeviceId(objDeviceEuiChild.deviceEUI));
            })
            const arrDeviceID = await Promise.all(arrPromiseGetDeviceID);
            console.log('arrGetDeviceID: ', arrDeviceID);
    
            const arrObjCommandReq = arrObjDeviceEuiChild.map((objDeviceEuiChild) => {
                // const deviceID = await getKey(makeKeyDeviceId(objDeviceEuiChild.deviceEUI));
                return {
                    deviceEUI : objDeviceEuiChild.deviceEUI,
                    deviceID : 'deviceID',
                    child : objDeviceEuiChild.child,
                    traitName : arrCommandControlConverted[0].traitName,
                    value: arrCommandControlConverted[0].value
                }
            })

            arrDeviceID.forEach((currentValue, index) => {
                arrObjCommandReq[index].deviceID = currentValue;
            })

            console.log('----------> arrObjCommandReq <----------------: ', arrObjCommandReq);
    
            const listDeviceResponseCommands = arrObjCommandReq.map((objDevice) => ({
                ids: [objDevice.deviceEUI],
                status: 'SUCCESS',
                states: {
                  online: true,
                  on: objDevice.value === 'On'? true : false,
                },
              }));
    
              console.log('----------> listDeviceResponseCommands: ', listDeviceResponseCommands);
              return listDeviceResponseCommands;   
        } catch (error) {
            return error;
        }
    },

    controlBrightness : async (arrObjDeviceEuiChild, arrCommandControlConverted) => {
        try {
            const arrPromiseGetDeviceID = arrObjDeviceEuiChild.map((objDeviceEuiChild) => {
                return getKey(makeKeyDeviceId(objDeviceEuiChild.deviceEUI));
            })
            const arrDeviceID = await Promise.all(arrPromiseGetDeviceID);
            console.log('arrGetDeviceID: ', arrDeviceID);
    
            const arrObjCommandReq = arrObjDeviceEuiChild.map((objDeviceEuiChild) => {
                // const deviceID = await getKey(makeKeyDeviceId(objDeviceEuiChild.deviceEUI));
                return {
                    deviceEUI : objDeviceEuiChild.deviceEUI,
                    deviceID : 'deviceID',
                    child : objDeviceEuiChild.child,
                    traitName : arrCommandControlConverted[0].traitName,
                    value: arrCommandControlConverted[0].value
                }
            })

            arrDeviceID.forEach((currentValue, index) => {
                arrObjCommandReq[index].deviceID = currentValue;
            })

            console.log('----------> arrObjCommandReq <----------------: ', arrObjCommandReq);
    
            const listDeviceResponseCommands = arrObjCommandReq.map((objDevice) => ({
                ids: [objDevice.deviceEUI],
                status: 'SUCCESS',
                states: {
                  online: true,
                  brightness: parseInt(objDevice.value),
                },
              }));
    
              console.log('----------> listDeviceResponseCommands: ', listDeviceResponseCommands);
              return listDeviceResponseCommands;   
        } catch (error) {
            return error;
        }
    },

    controlColor : async (arrObjDeviceEuiChild, arrCommandControlConverted) => {
        try {
            const arrPromiseGetDeviceID = arrObjDeviceEuiChild.map((objDeviceEuiChild) => {
                return getKey(makeKeyDeviceId(objDeviceEuiChild.deviceEUI));
            })
            const arrDeviceID = await Promise.all(arrPromiseGetDeviceID);
            console.log('arrGetDeviceID: ', arrDeviceID);
    
            const arrObjCommandReq = arrObjDeviceEuiChild.map((objDeviceEuiChild) => {
                // const deviceID = await getKey(makeKeyDeviceId(objDeviceEuiChild.deviceEUI));
                return {
                    deviceEUI : objDeviceEuiChild.deviceEUI,
                    deviceID : 'deviceID',
                    child : objDeviceEuiChild.child,
                    traitName : arrCommandControlConverted[0].traitName,
                    value: decToRgb(arrCommandControlConverted[0].value)
                }
            })

            arrDeviceID.forEach((currentValue, index) => {
                arrObjCommandReq[index].deviceID = currentValue;
            })

            console.log('----------> arrObjCommandReq <----------------: ', arrObjCommandReq);
    
            const listDeviceResponseCommands = arrObjCommandReq.map((objDevice) => ({
                ids: [objDevice.deviceEUI],
                status: 'SUCCESS',
                states: {
                  online: true,
                  color: {
                    spectrumRGB : arrCommandControlConverted[0].value
                  },
                },
              }));
    
              console.log('----------> listDeviceResponseCommands: ', listDeviceResponseCommands);
              return listDeviceResponseCommands;   
        } catch (error) {
            return error;
        }
    },
}

module.exports = {
    controlPhysicalDevice : async (arrDeviceEuiInDB, arrCommandControlConverted) => {
        console.group('controlDevice');
        const arrObjDeviceEuiAndChild = arrDeviceEuiInDB.map((deviceEUImix) => {
            return {
                deviceEUI : createRawDeviceEUI(deviceEUImix).deviceEUI,
                child : createRawDeviceEUI(deviceEUImix).child,
            }
        })

        console.log('arrObjDeviceEuiAndChild: ', arrObjDeviceEuiAndChild);

        const traitName = arrCommandControlConverted[0].traitName;

        switch(traitName) {
            case 'traitOnOff' :
                return await serviceControl.controlOnOff(arrObjDeviceEuiAndChild, arrCommandControlConverted);
            case 'traitBrightness' : 
                return await serviceControl.controlBrightness(arrObjDeviceEuiAndChild, arrCommandControlConverted);
            case 'traitColor' : 
                return await serviceControl.controlColor(arrObjDeviceEuiAndChild, arrCommandControlConverted);            
            default :
                console.log('ERROR, not support traitName: ', traitName);
        }

        console.groupEnd('controlDevice');
    },
}
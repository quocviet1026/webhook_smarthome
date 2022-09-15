const BasicLight = require('./light/device.basicLight');
const CctLight = require('./light/device.cctLight');
const RgbCctLight = require('./light/device.rgbCctLight');
const BasicOutlet = require('./outlet/Device.BasicOutlet');
const BasicSwitch = require('./switch/Device.BasicSwitch');
const TempHumiSensor = require('./sensor/Device.TempHumiSensor');
const SmokeSensor = require('./sensor/Device.SmokeSensor');

class DeviceFactory {
  static createDevice(dataDeviceCreate) {
    switch (dataDeviceCreate.deviceType) {
      case 'basicLight':
        return new BasicLight(dataDeviceCreate);
      case 'typeRDCCTLight':
        return new CctLight(dataDeviceCreate);
      case 'typeRDRGBCCTLight':
        return new RgbCctLight(dataDeviceCreate);
      case 'typeSmartPlug':
        return new BasicOutlet(dataDeviceCreate);
      case 'typeOnOffLight':
        return new BasicSwitch(dataDeviceCreate);
      case 'typeTempSensor':
        return new TempHumiSensor(dataDeviceCreate);
      case 'typeIASFire':
        return new SmokeSensor(dataDeviceCreate);
      default:
        console.log(
          `--->DeviceFactory-createDevice ERROR: notsupport ${dataDeviceCreate.type}`
        );
        break;
    }
  }
}

module.exports = DeviceFactory;

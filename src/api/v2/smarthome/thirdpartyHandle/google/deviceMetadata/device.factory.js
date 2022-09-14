const BasicLight = require('./light/device.basicLight');
const CctLight = require('./light/device.cctLight');
const RgbCctLight = require('./light/device.rgbCctLight');
const BasicOutlet = require('./outlet/Device.BasicOutlet');
const BasicSwitch = require('./switch/Device.BasicSwitch');
const TempHumiSensor = require('./sensor/Device.TempHumiSensor');
const SmokeSensor = require('./sensor/Device.SmokeSensor');

class DeviceFactory {
  static createDevice(dataDeviceCreate) {
    switch (dataDeviceCreate.type) {
      case 'basicLight':
        return new BasicLight(dataDeviceCreate);
      case 'cctLight':
        return new CctLight(dataDeviceCreate);
      case 'rgbCctLight':
        return new RgbCctLight(dataDeviceCreate);
      case 'basicOutlet':
        return new BasicOutlet(dataDeviceCreate);
      case 'basicSwitch':
        return new BasicSwitch(dataDeviceCreate);
      case 'tempHumiSensor':
        return new TempHumiSensor(dataDeviceCreate);
      case 'smokeSensor':
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

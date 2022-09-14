require('dotenv').config();
const os = require('os');
const app = require('./app');
// const oneHomeHandle = require('./src/api/v1/smarthome/oneHomeHandle/routes/oneHome.route');
const oneHomeHandle = require('./src/api/v2/smarthome/oneHomeHandle/routes/oneHome.route');
// console.log(os.cpus().length);
process.env.UV_THREADPOOL_SIZE = os.cpus().length;
const PORT = process.env.PORT || 3636;

app.listen(PORT, () => {
  console.log(`Server Listen at ${PORT}`);
});

// const DeviceModel = require('./src/api/v1/smarthome/Device/device.model');

// const basicLight1 = new DeviceModel({
//   id: '0x0002',
//   name: 'basic_light_2',
//   connectType: 'bluetooth',
//   type: 'basicLight',
//   gatewayId: 'GW0001',
//   userId: '62cd52e00e9608a25f8fff6a',
//   online: true,
// });

// const savedUser = basicLight1
//   .save()
//   .then((result) => {
//     console.log(`save data success: ${result}`);
//   })
//   .catch((err) => {
//     console.log(`save data error: ${err}`);
//   });

// const redisService = require('./src/api/v1/helpers/redisService');

// redisService.setKey('0x0002', 'GW0002');
// redisService.getKey('keyTest1').then((data) => {
//   console.log(data);
// });

// const arrayDeviceId = [
//   {
//     id: '0x0001',
//     customData: {
//       fooValue: 74,
//       barValue: true,
//       bazValue: 'sheepdip',
//     },
//   },
//   {
//     id: '0x0001',
//     customData: {
//       fooValue: 36,
//       barValue: false,
//       bazValue: 'moarsheep',
//     },
//   },
// ];

// async function getGatewayId(listDeviceId) {
//   const listGatewayIdPromise = listDeviceId.map((ObjDevice) =>
//     redisService.getKey(ObjDevice.id)
//   );

//   const listGatewayId = await Promise.all(listGatewayIdPromise);

//   return listGatewayId;
// }

// getGatewayId(arrayDeviceId).then((data) => {
//   console.log('data: ', data);
//   arrayDeviceId.forEach((objDevice, index) => {
//     objDevice.gatewayId = data[index];
//   });
//   console.log(arrayDeviceId);
// });

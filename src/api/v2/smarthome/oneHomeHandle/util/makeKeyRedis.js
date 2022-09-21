module.exports = {
  makeKeyGatewayId: (deviceEUI) => `${deviceEUI}#$%@@gatewayId`, //Input is real deviceEUI, not include child
  
  makeKeyDeviceId: (deviceEUI) => `${deviceEUI}#$%@@deviceID`, //Input is real deviceEUI, not include child

  makeKeyUserId: (deviceEUI) => `${deviceEUI}#$%@@userId`, //Input is real deviceEUI, not include child

  getRawDeviceEUI: (mixKeyDeviceEUI) => mixKeyDeviceEUI.split('#$%@@')[0],
};

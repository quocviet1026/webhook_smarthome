/* Function handle Convert Id device:
- Mix 'eui' and 'child' -> 'deviceEUI'
- cut 'id' -> 'eui' , 'child' 
*/

module.exports = {
  createArrayDeviceEUI: (deviceEUI, arrayChild) => {
    let arrayDeviceEUI = [];
    arrayDeviceEUI = arrayChild.map(
      (child) => `${deviceEUI}#$%@@${child.toString()}`
    );
    return arrayDeviceEUI;
  },

  createMixDeviceEUI: (deviceEUI, child) => {
    const deviceEuiReturn = `${deviceEUI}#$%@@${child.toString()}`;
    return deviceEuiReturn;
  },

  createRawDeviceEUI: (mixDeviceEUI) => ({
    deviceEUI: mixDeviceEUI.split('#$%@@')[0],
    child: mixDeviceEUI.split('#$%@@')[1],
  }),
};

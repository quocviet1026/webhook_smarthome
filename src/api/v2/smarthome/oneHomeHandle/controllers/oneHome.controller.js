const {
  addDevice,
  removeDevice,
  //   controlDevice,
  updateTrait,
} = require('../services/oneHome.service');

module.exports = {
  register: (messageParsed) => {
    // eslint-disable-next-line prettier/prettier
    console.group('\n\n---------------------oneHome Controller >register< ---------------------');
    console.log('messageParsed: ', messageParsed);
    const registerType = messageParsed.dataMessage.properties.command;
    const objectDevice = messageParsed.dataMessage.properties.data;
    if (registerType === 'addDevice') {
      addDevice(objectDevice);
    } else if (registerType === 'removeDevice') {
      removeDevice(objectDevice);
    } else {
      console.log(`ERROR, not support register type ${registerType}`);
    }

    // eslint-disable-next-line prettier/prettier
    console.groupEnd('\n\n---------------------oneHome Controller >register< ---------------------');
  },

  control: (messageParsed) => {
    // eslint-disable-next-line prettier/prettier
    console.group('\n\n---------------------oneHome Controller >control< ---------------------');
    console.log('messageParsed: ', messageParsed);

    // eslint-disable-next-line prettier/prettier
    console.groupEnd('\n\n---------------------oneHome Controller >control< ---------------------');
  },

  updateData: (messageParsed) => {
    // eslint-disable-next-line prettier/prettier
    console.group('\n\n---------------------oneHome Controller >updateData< ---------------------');
    console.log('messageParsed: ', messageParsed);
    const updateType = messageParsed.dataMessage.properties.command;
    if(updateType === 'updateTrait') {
      updateTrait(messageParsed);
    }
    // eslint-disable-next-line prettier/prettier
    console.groupEnd('\n\n---------------------oneHome Controller >updateData< ---------------------');
  },
};

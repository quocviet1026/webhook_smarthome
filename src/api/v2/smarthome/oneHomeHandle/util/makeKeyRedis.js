module.exports = {
    makeKeyGatewayId : (deviceEUI) => {
        return deviceEUI + '_gatewayID';
    },
    makeKeyDeviceId : (deviceEUI) => {
        return deviceEUI + '_deviceEUI';
    },
}
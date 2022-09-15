/* Function handle Convert Id device:
- Mix 'eui' and 'child' -> 'deviceEUI'
- cut 'id' -> 'eui' , 'child' 
*/

module.exports = {
    createDeviceEUI : (deviceEUI, arrayChild) => {
        let arrayDeviceEUI = [];
        arrayDeviceEUI = arrayChild.map(child => {
            return deviceEUI + '_' + child.toString();
        });
        return(arrayDeviceEUI);
    },
}
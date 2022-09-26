module.exports = {
    rgbToHex : (r, g, b) => {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    },

    rgbToDec : (r, g, b) => {
        const hex = ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        return parseInt(hex, 16);
    },

    hexToRgb : (stringHex) => {
        const aRgbHex = stringHex.match(/.{1,2}/g);
        const aRgb = `"${parseInt(aRgbHex[0], 16)},${parseInt(aRgbHex[1], 16)},${parseInt(aRgbHex[2], 16)}"`;
            
        return aRgb;   //"R, G, B"
    },

    decToRgb : (decNum) => {
        const stringHex = decNum.toString(16);
        const aRgbHex = stringHex.match(/.{1,2}/g);
        const aRgb = `"${parseInt(aRgbHex[0], 16)},${parseInt(aRgbHex[1], 16)},${parseInt(aRgbHex[2], 16)}"`;
            
        return aRgb;   //"R, G, B"
    }
}
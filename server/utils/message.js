const moment = require('moment');

let generateMessage = (from, text) => {
    return {
        from,
        text,
        createdAt: moment().valueOf()
    };
};

let generateLocationMessage = (from, coords) => {
    return {
        from,
        url: `https://www.google.de/maps?q=${coords.latitude},${coords.longitude}`,
        createdAt: moment().valueOf()
    }
};

module.exports = {generateMessage, generateLocationMessage};
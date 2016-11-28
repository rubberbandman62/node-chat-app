const expect = require('expect');
const moment = require('moment');
const {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
    it('should generate correct message object', () => {
        const from = "Hartwig";
        const text = "Some text";
        const message = generateMessage(from, text);
        expect(message.from).toBe(from);
        expect(message.text).toBe(text);
        expect(message.createdAt).toBeA('number');
    });
});

describe('generateLocationMessage', () => {
    it('should generate correct location message object', () => {
        const from = "Hartwig";
        const coords = {latitude: 1, longitude: 2};
        const message = generateLocationMessage(from, coords);

        expect(message.createdAt).toBeA('number');
        expect(message.from).toBe(from);
        expect(message.url).toExist();
        expect(message.url).toBe('https://www.google.de/maps?q=1,2');
    });
});
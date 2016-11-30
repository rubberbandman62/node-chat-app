const expect = require('expect');

const {isRealString} = require('./validation');

describe('isRealString', () => {
    it('should reject non-string values', () => {
        expect(isRealString(89)).toBe(false);
        expect(isRealString(true)).toBe(false);
        expect(isRealString(undefined)).toBe(false);
        expect(isRealString(null)).toBe(false);
        expect(isRealString([])).toBe(false);
        expect(isRealString({})).toBe(false);
    });

    it('should reject strings with only spaces', () => {
        expect(isRealString('   ')).toBe(false);
        expect(isRealString('')).toBe(false);
    });

    it('should allow strings with non-space characters', () => {
        expect(isRealString('    Hallo   ')).toBe(true);
        expect(isRealString('743')).toBe(true);
    });
})
import validate from '../src/validate';
import StringScalar from '../src/string';

const testScalar = new StringScalar('test');

describe('min, max and length', () => {
  it('throws when limit is not a number', () => {
    expect(() => testScalar.min('a')).toThrowError(TypeError);
    expect(() => testScalar.max('a')).toThrowError(TypeError);
    expect(() => testScalar.length('a')).toThrowError(TypeError);
  });

  it('throws when limit is not an integer', () => {
    expect(() => testScalar.min(1.2)).toThrowError(TypeError);
    expect(() => testScalar.max(1.2)).toThrowError(TypeError);
    expect(() => testScalar.length(1.2)).toThrowError(TypeError);
  });

  it('throws when limit is not a positive integer', () => {
    expect(() => testScalar.min(-1)).toThrowError(RangeError);
    expect(() => testScalar.max(-1)).toThrowError(RangeError);
    expect(() => testScalar.length(-1)).toThrowError(RangeError);
  });

  it('does not throw for positive integer', () => {
    expect(() => testScalar.min(0)).not.toThrow();
    expect(() => testScalar.min(1)).not.toThrow();
    expect(() => testScalar.max(0)).not.toThrow();
    expect(() => testScalar.max(1)).not.toThrow();
    expect(() => testScalar.length(0)).not.toThrow();
    expect(() => testScalar.length(1)).not.toThrow();
  });
});

describe('min', () => {
  it('throws when limit is larger than max', () => {
    expect(() => testScalar.max(0).min(1)).toThrowError(RangeError);
  });

  it('throws when length attribute is present', () => {
    expect(() => testScalar.length(0).min(1)).toThrowError(RangeError);
  });

  it('passes when min length is met', () => {
    const GraphQLExactString = testScalar.min(1).create();
    expect(validate('1', GraphQLExactString)).toEqual([]);
  });

  it('throws when min length is not met', () => {
    const GraphQLExactString = testScalar.min(1).create();
    expect(validate('', GraphQLExactString)).not.toEqual([]);
  });
});

describe('max', () => {
  it('throws when limit is smaller than min', () => {
    expect(() => testScalar.min(1).max(0)).toThrowError(RangeError);
  });

  it('throws when length attribute is present', () => {
    expect(() => testScalar.length(0).max(1)).toThrowError(RangeError);
  });

  it('throws when length attribute is present', () => {
    expect(() => testScalar.length(0).max(1)).toThrowError(RangeError);
  });

  it('passes when max length is met', () => {
    const GraphQLExactString = testScalar.max(1).create();
    expect(validate('1', GraphQLExactString)).toEqual([]);
  });

  it('throws when max length is not met', () => {
    const GraphQLExactString = testScalar.max(1).create();
    expect(validate('12', GraphQLExactString)).not.toEqual([]);
  });
});

describe('length', () => {
  it('throws when min or max attributes are present', () => {
    expect(() => testScalar.min(1).length(2)).toThrowError(RangeError);
    expect(() => testScalar.max(1).length(2)).toThrowError(RangeError);
  });

  it('passes when exact length is met', () => {
    const GraphQLExactString = testScalar.length(1).create();
    expect(validate('1', GraphQLExactString)).toEqual([]);
  });

  it('throws when exact length is not met', () => {
    const GraphQLExactString = testScalar.length(1).create();
    expect(validate('12', GraphQLExactString)).not.toEqual([]);
  });
});


describe('StringScalar', () => {
  const BasicString = testScalar.create();

  it('serializes output strings', () => {
    expect(BasicString.serialize('string')).toBe('string');
    expect(BasicString.serialize(1)).toBe('1');
    expect(BasicString.serialize(-1.1)).toBe('-1.1');
    expect(BasicString.serialize(true)).toBe('true');
    expect(BasicString.serialize(false)).toBe('false');
  });

  it('passes with max and min', () => {
    const GraphQLMinMaxString = testScalar.min(1).max(2).create();
    expect(validate('1', GraphQLMinMaxString)).toEqual([]);
    expect(validate('12', GraphQLMinMaxString)).toEqual([]);
    expect(validate('', GraphQLMinMaxString)).not.toEqual([]);
    expect(validate('123', GraphQLMinMaxString)).not.toEqual([]);
  });
});

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

  const GraphQLExactString = testScalar.min(1).create();

  it('passes when min length is met', () => {
    expect(validate('1', GraphQLExactString)).toEqual([]);
  });

  it('throws when min length is not met', () => {
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

  const GraphQLExactString = testScalar.max(1).create();

  it('passes when max length is met', () => {
    expect(validate('1', GraphQLExactString)).toEqual([]);
  });

  it('throws when max length is not met', () => {
    expect(validate('12', GraphQLExactString)).not.toEqual([]);
  });
});

describe('length', () => {
  it('throws when min or max attributes are present', () => {
    expect(() => testScalar.min(1).length(2)).toThrowError(RangeError);
    expect(() => testScalar.max(1).length(2)).toThrowError(RangeError);
  });

  const GraphQLExactString = testScalar.length(1).create();

  it('passes when exact length is met', () => {
    expect(validate('1', GraphQLExactString)).toEqual([]);
  });

  it('throws when exact length is not met', () => {
    expect(validate('12', GraphQLExactString)).not.toEqual([]);
  });
});

describe('truncate', () => {
  const GraphQLExactString = testScalar.truncate(1).create();

  it('truncates when length exceeds limit', () => {
    expect(GraphQLExactString.serialize('12')).toEqual('1');
  });

  it('does not truncates when length exceeds limit', () => {
    expect(GraphQLExactString.serialize('')).toEqual('');
  });
});

describe('alphanum', () => {
  const GraphQLAlphanumeric = testScalar.alphanum().create();

  it('passes when string is alphanumeric', () => {
    expect(validate('aA0', GraphQLAlphanumeric)).toEqual([]);
  });

  it('throws when string is not alphanumeric', () => {
    expect(validate('', GraphQLAlphanumeric)).not.toEqual([]);
  });
});

describe('creditCard', () => {
  const GraphQLCreditCard = testScalar.creditCard().create();

  function validateAll(...values) {
    values.forEach((creditCard) => {
      expect(validate(creditCard, GraphQLCreditCard)).toEqual([]);
    });
  }

  it('passes when string is a credit card', () => {
    validateAll(
      '378734493671000',  // american express
      '371449635398431',  // american express
      '378282246310005',  // american express
      '341111111111111',  // american express
      '5610591081018250', // australian bank
      '5019717010103742', // dankort pbs
      '38520000023237',   // diners club
      '30569309025904',   // diners club
      '6011000990139424', // discover
      '6011111111111117', // discover
      '6011601160116611', // discover
      '3566002020360505', // jbc
      '3530111333300000', // jbc
      '5105105105105100', // mastercard
      '5555555555554444', // mastercard
      '5431111111111111', // mastercard
      '6331101999990016', // switch/solo paymentech
      '4222222222222',    // visa
      '4012888888881881', // visa
      '4111111111111111', // visa
    );
  });

  it('throws when string is not a credit card', () => {
    expect(validate('', GraphQLCreditCard)).not.toEqual([]);
    expect(validate('4111111111111112', GraphQLCreditCard)).not.toEqual([]);
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

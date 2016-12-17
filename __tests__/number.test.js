import validate from '../src/validate';
import NumberScalar from '../src/number';

const testScalar = new NumberScalar('test');

describe('NumberScalar', () => {
  const BasicNumber = testScalar.create();

  it('parseValue output numbers', () => {
    expect(BasicNumber.parseValue(null)).toBe(0);
    expect(BasicNumber.parseValue(undefined)).toEqual(NaN);
    expect(BasicNumber.parseValue('string')).toEqual(NaN);
    expect(BasicNumber.parseValue('')).toBe(0);
    expect(BasicNumber.parseValue(1)).toBe(1);
    expect(BasicNumber.parseValue(0)).toBe(0);
    expect(BasicNumber.parseValue(true)).toBe(1);
    expect(BasicNumber.parseValue(false)).toBe(0);
  });
});

describe('min, max, greater and lesser', () => {
  it.skip('throws when limit is not a number', () => {
    expect(() => testScalar.min('a')).toThrowError(TypeError);
    expect(() => testScalar.max('a')).toThrowError(TypeError);
    expect(() => testScalar.greater('a')).toThrowError(TypeError);
    expect(() => testScalar.lesser('a')).toThrowError(TypeError);
  });

  it('does not throw for number', () => {
    expect(() => testScalar.min(0.0)).not.toThrow();
    expect(() => testScalar.min(1)).not.toThrow();
    expect(() => testScalar.max(0.0)).not.toThrow();
    expect(() => testScalar.max(1)).not.toThrow();
    expect(() => testScalar.greater(0.0)).not.toThrow();
    expect(() => testScalar.greater(1)).not.toThrow();
    expect(() => testScalar.lesser(0.0)).not.toThrow();
    expect(() => testScalar.lesser(1)).not.toThrow();
  });

  it('works when min and max are equal', () => {
    const GraphQLZeroToTwo = testScalar.min(0).max(0).create();
    expect(GraphQLZeroToTwo.parseValue(0)).toBe(0);
    expect(GraphQLZeroToTwo.parseValue(0.0)).toBe(0);
    expect(() => GraphQLZeroToTwo.parseValue(1)).toThrow(TypeError);
  });

  it('works together', () => {
    const GraphQLZeroToTwo = testScalar.min(0).max(2).lesser(2).create();
    expect(GraphQLZeroToTwo.parseValue(1)).toBe(1);
    expect(GraphQLZeroToTwo.parseValue(0.1)).toBe(0.1);
    expect(() => GraphQLZeroToTwo.parseValue(2)).toThrow(TypeError);
    expect(() => GraphQLZeroToTwo.parseValue(3)).toThrow(TypeError);
  });
});

describe('min', () => {
  it('throws when limit is larger than max', () => {
    expect(() => testScalar.max(0).min(1)).toThrowError(RangeError);
  });

  it('throws when limit is smaller or equal to greater', () => {
    expect(() => testScalar.greater(1).min(1)).toThrowError(RangeError);
    expect(() => testScalar.greater(1).min(0)).toThrowError(RangeError);
  });

  it('throws when limit is larger or equal to lesser', () => {
    expect(() => testScalar.lesser(1).min(1)).toThrowError(RangeError);
    expect(() => testScalar.lesser(1).min(2)).toThrowError(RangeError);
  });

  const GraphQLPositiveNum = testScalar.min(1).create();

  it('passes when min value is met', () => {
    expect(validate(1, GraphQLPositiveNum)).toEqual([]);
  });

  it('throws when min value is not met', () => {
    expect(validate(0, GraphQLPositiveNum)).not.toEqual([]);
  });
});

describe('max', () => {
  it('throws when limit is smaller than min', () => {
    expect(() => testScalar.min(1).max(0)).toThrowError(RangeError);
  });

  it('throws when limit is smaller or equal to greater', () => {
    expect(() => testScalar.greater(1).max(1)).toThrowError(RangeError);
    expect(() => testScalar.greater(1).max(0)).toThrowError(RangeError);
  });

  it('throws when limit is larger or equal to lesser', () => {
    expect(() => testScalar.lesser(1).max(1)).toThrowError(RangeError);
    expect(() => testScalar.lesser(1).max(2)).toThrowError(RangeError);
  });

  const GraphQLPositiveNum = testScalar.max(1).create();

  it('passes when max value is met', () => {
    expect(validate(1, GraphQLPositiveNum)).toEqual([]);
  });

  it('throws when max value is not met', () => {
    expect(validate(2, GraphQLPositiveNum)).not.toEqual([]);
  });
});

describe('greater', () => {
  it('throws when limit is smaller than min', () => {
    expect(() => testScalar.min(1).greater(0)).toThrowError(RangeError);
  });

  it('throws when limit is larger or equal to max', () => {
    expect(() => testScalar.max(1).greater(1)).toThrowError(RangeError);
    expect(() => testScalar.max(1).greater(2)).toThrowError(RangeError);
  });

  it('throws when limit is larger or equal to lesser', () => {
    expect(() => testScalar.lesser(1).greater(1)).toThrowError(RangeError);
    expect(() => testScalar.lesser(1).greater(2)).toThrowError(RangeError);
  });

  const GraphQLPositiveNum = testScalar.greater(1).create();

  it('passes when greater value is met', () => {
    expect(validate(1.1, GraphQLPositiveNum)).toEqual([]);
  });

  it('throws when greater value is not met', () => {
    expect(validate(1, GraphQLPositiveNum)).not.toEqual([]);
  });
});

describe('lesser', () => {
  it('throws when limit is smaller or equal to min', () => {
    expect(() => testScalar.min(1).lesser(1)).toThrowError(RangeError);
    expect(() => testScalar.min(1).lesser(0)).toThrowError(RangeError);
  });

  it('throws when limit is larger than max', () => {
    expect(() => testScalar.max(0).lesser(1)).toThrowError(RangeError);
  });

  it('throws when limit is smaller or equal to greater', () => {
    expect(() => testScalar.greater(1).lesser(0)).toThrowError(RangeError);
    expect(() => testScalar.greater(1).lesser(1)).toThrowError(RangeError);
  });

  const GraphQLPositiveNum = testScalar.lesser(1).create();

  it('passes when lesser value is met', () => {
    expect(validate(0.9, GraphQLPositiveNum)).toEqual([]);
  });

  it('throws when lesser value is not met', () => {
    expect(validate(1, GraphQLPositiveNum)).not.toEqual([]);
  });
});

describe('precision', () => {
  const GraphQLMoney = testScalar.precision(2).create();

  it('passes when value is precision of limit', () => {
    expect(validate(0.00, GraphQLMoney)).toEqual([]);
  });

  it('throws when value exceeds precision of limit', () => {
    expect(validate(0.001, GraphQLMoney)).not.toEqual([]);
  });

  it('throws when limit is not positive', () => {
    expect(() => testScalar.precision(-2)).toThrow();
  });

  it('throws when limit is not an integer', () => {
    expect(() => testScalar.precision(0.1)).toThrow();
  });
});

describe('multiple', () => {
  const GraphQLEven = testScalar.multiple(2).create();

  it('passes when value is multiple of base', () => {
    expect(validate(2, GraphQLEven)).toEqual([]);
  });

  it('throws when lesser value is not met', () => {
    expect(validate(1, GraphQLEven)).not.toEqual([]);
  });
});

describe('positive', () => {
  const GraphQLPositiveNum = testScalar.positive().create();

  it('passes when value is positive', () => {
    expect(validate(1, GraphQLPositiveNum)).toEqual([]);
  });

  it('throws when value is negative', () => {
    expect(validate(-1, GraphQLPositiveNum)).not.toEqual([]);
  });
});

describe('negative', () => {
  const GraphQLNegativeNum = testScalar.negative().create();

  it('passes when value is negative', () => {
    expect(validate(-1, GraphQLNegativeNum)).toEqual([]);
  });

  it('throws when value is positive', () => {
    expect(validate(1, GraphQLNegativeNum)).not.toEqual([]);
  });
});

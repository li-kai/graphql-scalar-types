import BooleanScalar from '../src/boolean';

const testScalar = new BooleanScalar('test');

describe('BooleanScalar', () => {
  const BasicBoolean = testScalar.create();

  it('parseValue output booleans', () => {
    expect(BasicBoolean.parseValue(null)).toBe(false);
    expect(BasicBoolean.parseValue(undefined)).toBe(false);
    expect(BasicBoolean.parseValue('string')).toBe(true);
    expect(BasicBoolean.parseValue('')).toBe(false);
    expect(BasicBoolean.parseValue(1)).toBe(true);
    expect(BasicBoolean.parseValue(0)).toBe(false);
    expect(BasicBoolean.parseValue(true)).toBe(true);
    expect(BasicBoolean.parseValue(false)).toBe(false);
  });
});

describe('truthy', () => {
  it('allows additional value', () => {
    const GraphQLTwoBoolean = testScalar.truthy(0).create();
    expect(GraphQLTwoBoolean.parseValue(0)).toBe(true);
  });

  it('allows additional values', () => {
    const GraphQLTwoBoolean = testScalar.truthy(0, '').create();
    expect(GraphQLTwoBoolean.parseValue(0)).toBe(true);
    expect(GraphQLTwoBoolean.parseValue('')).toBe(true);
  });

  it('allows array as values', () => {
    const GraphQLTwoBoolean = testScalar.truthy([0, '']).create();
    expect(GraphQLTwoBoolean.parseValue(0)).toBe(true);
    expect(GraphQLTwoBoolean.parseValue('')).toBe(true);
  });
});

describe('falsy', () => {
  it('allows additional value', () => {
    const GraphQLTwoBoolean = testScalar.falsy(1).create();
    expect(GraphQLTwoBoolean.parseValue(1)).toBe(false);
  });

  it('allows additional values', () => {
    const GraphQLTwoBoolean = testScalar.falsy(1, 2).create();
    expect(GraphQLTwoBoolean.parseValue(1)).toBe(false);
    expect(GraphQLTwoBoolean.parseValue(2)).toBe(false);
  });

  it('allows array as values', () => {
    const GraphQLTwoBoolean = testScalar.falsy([1, 2]).create();
    expect(GraphQLTwoBoolean.parseValue(1)).toBe(false);
    expect(GraphQLTwoBoolean.parseValue(2)).toBe(false);
  });
});

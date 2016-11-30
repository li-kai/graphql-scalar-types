import {
  GraphQLScalarType,
  GraphQLNonNull,
} from 'graphql';
import Base from '../src/base';

// scalars must implement serialize, but Base does not
class FakeBase extends Base {
  serialize() { // eslint-disable-line class-methods-use-this
    return null;
  }
}

const name = 'name';
const description = 'test';

describe('constructor', () => {
  it('takes in a name', () => {
    const base = new Base(name);
    expect(base.name).toEqual(name);
  });

  it('throws if name is undefined', () => {
    expect(() => new Base()).toThrow();
  });

  it('throws if name is null', () => {
    expect(() => new Base(null)).toThrow();
  });

  it('throws if name is not a string', () => {
    expect(() => new Base(1)).toThrow();
  });

  it('throws if name is invalid', () => {
    expect(() => new Base('')).toThrow();
  });
});

describe('description', () => {
  it('takes in a string', () => {
    const base = new Base(name).description(description);
    expect(base.description).toEqual(description);
  });

  it('throws if description is invalid', () => {
    const base = new Base(name);
    expect(() => base.description(5)).toThrow();
  });
});

describe('nonNull', () => {
  /* eslint-disable no-underscore-dangle */
  it('sets the nonNull flag', () => {
    const base = new Base(name);
    expect(base._isNonNull).toBeFalsy();
    expect(base.nonNull()._isNonNull).toBeTruthy();
  });

  it('accepts a boolean as parameter', () => {
    const base = new Base(name).nonNull(false);
    expect(base._isNonNull).toBeFalsy();
  });
  /* eslint-enable no-underscore-dangle */
});

describe('clone', () => {
  const base = new Base(name).description(description);
  const clonedBase = base.clone();
  const fakeBase = new FakeBase(name).description(description);
  const fakeClonedBase = fakeBase.clone();

  it('is instance of Base class', () => {
    expect(clonedBase).toBeInstanceOf(Base);
    expect(clonedBase).not.toBeInstanceOf(FakeBase);
  });

  it('properties equal original', () => {
    expect(clonedBase).toEqual(base);
  });

  it.skip('is a deep copy', () => {
    const testVar = 4;
    base.x = { testVar };
    const anotherClone = base.clone();
    base.x.testVar = 6;
    expect(anotherClone).not.toEqual(base);
  });

  it('works with inheritance', () => {
    expect(fakeClonedBase).toBeInstanceOf(FakeBase);
  });
});

describe('create', () => {
  it('creates a GraphQLScalarType type', () => {
    const scalar = new FakeBase(name).description(description).create();
    expect(scalar).toBeInstanceOf(GraphQLScalarType);
    expect(scalar.name).toEqual(name);
    expect(scalar.description).toEqual(description);
    expect(scalar.serialize()).toBeNull();
  });

  it('creates a GraphQLNonNull type', () => {
    const nonNull = new FakeBase(name).nonNull().create();
    expect(nonNull).toBeInstanceOf(GraphQLNonNull);
  });
});

import graphqlScalarTypes from '../src';
import StringScalar from '../src/string';
import BooleanScalar from '../src/boolean';
import NumberScalar from '../src/number';

describe('index', () => {
  it('exposes string type', () => {
    const BasicString = graphqlScalarTypes.string('Name');
    expect(BasicString).toBeInstanceOf(StringScalar);
  });

  it('exposes boolean type', () => {
    const BasicBoolean = graphqlScalarTypes.boolean('Name');
    expect(BasicBoolean).toBeInstanceOf(BooleanScalar);
  });

  it('exposes number type', () => {
    const BasicNumber = graphqlScalarTypes.number('Name');
    expect(BasicNumber).toBeInstanceOf(NumberScalar);
  });
});

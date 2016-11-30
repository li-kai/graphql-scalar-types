import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLScalarType,
  isValidJSValue,
  GraphQLInt,
} from 'graphql';

function schemaWithFieldType(type) {
  return new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'Query',
      fields: { f: { type } },
    }),
    types: [type],
  });
}

describe('graphql', () => {
  it('is exposing types correctly', () => {
    expect(() =>
      schemaWithFieldType(new GraphQLScalarType({
        name: 'SomeScalar',
        serialize: () => null,
      })),
    ).not.toThrow();
  });

  it('does not allow invalid names', () => {
    expect(() =>
      new GraphQLScalarType({
        name: '',
        serialize: () => null,
      }),
    ).toThrow();
    expect(() =>
      new GraphQLScalarType({
        name: null,
        desciption: { a: 'lol' },
        serialize: () => null,
      }),
    ).toThrow();
  });

  it('is providing method for validation', () => {
    expect(isValidJSValue(1, GraphQLInt)).toEqual([]);
  });
});

/* flow */
import {
  GraphQLScalarType,
  GraphQLNonNull,
  assertValidName,
} from 'graphql';
import type {
  ValueNode,
} from 'graphql';

/**
 * Abstract base class to create GraphQLScalars.
 * @abstract
 */
class Base<TInternal, TExternal> {

  name: string;
  description: ?string;
  _func: Array<(value: String) => String>;
  _isNonNull: ?boolean;
  serialize: (value: mixed) => ?TExternal;
  parseValue: (value: mixed) => ?TInternal;
  parseLiteral: (valueNode: ValueNode) => ?TInternal;

  /**
   * Constructs a builder with a name for the GraphQLScalar.
   * @example const GraphQLStringBuilder = GraphQLScalarTypes.string('Name');
   * @example const GraphQLNumberBuilder = GraphQLScalarTypes.number('Age');
   * @example const GraphQLBooleanBuilder = GraphQLScalarTypes.boolean('SpecialFalsy');
   */
  constructor(name: string) {
    if (!name) {
      throw new Error('Type must be named');
    }
    assertValidName(name);
    this.name = name;
    this._func = [];
  }

  /**
   * Gives a description to the GraphQLScalar.
   */
  describe(description: string) {
    if (typeof description !== 'string') {
      throw new TypeError('description must be a string');
    }
    const obj = this.clone();
    obj.description = description;
    return obj;
  }

  /**
   * Makes the GraphQLScalar reject `null` as a value.
   * @param {boolean} [isNonNull=true] Default value is true.
   */
  nonNull(isNonNull:boolean = true) {
    const obj = this.clone();
    obj._isNonNull = isNonNull;
    return obj;
  }

  /**
   * Clones the builder.
   */
  clone() {
    const obj = Object.assign(Object.create(this), this);
    obj._func = obj._func.slice();
    return obj;
  }

  /**
   * Generates the GraphQLScalar.
   */
  create(): GraphQLScalarType<TInternal, TExternal> {
    const scalar: GraphQLScalarType<TInternal, TExternal> = new GraphQLScalarType({
      name: this.name,
      description: this.description,
      serialize: this.serialize,
      parseValue: this.parseValue,
      parseLiteral: this.parseLiteral,
    });
    return this._isNonNull ? new GraphQLNonNull(scalar) : scalar;
  }
}

export default Base;

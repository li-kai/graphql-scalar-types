/* flow */
import { Kind } from 'graphql';
import Base from './base';
import { compose, flatten } from './utils';

/**
 * Boolean scalar type that represents boolean data.
 * By itself, it is essentially the `GraphQLBoolean` type.
 */
class BooleanScalar extends Base<Boolean, Boolean> {

  /**
   * Converts additional values to `true` during serialization.
   * Accepts a value or an array of values.
   * @example const GraphQLSpecialBool = GraphQLScalars.truthy(0, '').create();
   * @example const GraphQLSpecialBool = GraphQLScalars.truthy([0, '']).create();
   */
  truthy(...params: mixed) {
    const values = flatten(params);
    const obj = this.clone();
    obj._func.push((value) => {
      return values.indexOf(value) >= 0 ? true : value;
    });
    return obj;
  }

  /**
   * Converts additional values to `false` during serialization.
   * Accepts a value or an array of values.
   * @example const GraphQLSpecialBool = GraphQLScalars.falsy(1, 2).create();
   * @example const GraphQLSpecialBool = GraphQLScalars.falsy([1, 2]).create();
   */
  falsy(...params: mixed) {
    const values = flatten(params);
    const obj = this.clone();
    obj._func.push((value) => {
      return values.indexOf(value) >= 0 ? false : value;
    });
    return obj;
  }

  create() {
    const coerce: (value: mixed) => Boolean = compose([...this._func, Boolean]);
    this.serialize = coerce;
    this.parseValue = coerce;
    this.parseLiteral = (ast) => {
      return ast.kind === Kind.BOOLEAN ? ast.value : null;
    };
    return super.create();
  }
}

export default BooleanScalar;

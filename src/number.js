/* flow */
import { Kind, GraphQLFloat, GraphQLInt } from 'graphql';
import Base from './base';
import { compose } from './utils';

function checksize(limit: number, comparator: string, isValidNum: (size: number) => boolean) {
  return (value) => {
    if (isValidNum(value)) {
      return value;
    }
    throw new TypeError(`Number must be ${comparator} ${limit}, got ${value}`);
  };
}

/**
 * Number scalar type that represents numerical data.
 * By itself, it is essentially the `GraphQLFloat` type.
 */
class NumberScalar extends Base<Number, Number> {

  _isInt: boolean;
  _min: number;
  _max: number;
  _greater: number;
  _lesser: number;

  /**
   * Specifies the minimum number allowed (inclusive).
   */
  min(limit: number) {
    if (limit > this._max || limit >= this._lesser) {
      throw new RangeError('limit cannot be larger than the largest allowed value');
    }
    if (limit <= this._greater) {
      throw new RangeError('limit cannot be smaller or equal to the smallest allowed value');
    }
    const obj = this.clone();
    obj._min = limit;
    obj._func.push(checksize(limit, 'larger or equal to', size => size >= limit));
    return obj;
  }

  /**
   * Specifies the maximum number allowed (inclusive).
   */
  max(limit: number) {
    if (limit < this._min || limit <= this._greater) {
      throw new RangeError('limit cannot be smaller than the smallest allowed value');
    }
    if (limit >= this._lesser) {
      throw new RangeError('limit cannot be larger or equal to the largest allowed value');
    }
    const obj = this.clone();
    obj._max = limit;
    obj._func.push(checksize(limit, 'smaller or equal to', size => size <= limit));
    return obj;
  }

  /**
   * Specifies that the value must be greater than the limit.
   */
  greater(limit: number) {
    if (limit >= this._lesser || limit >= this._max) {
      throw new RangeError('limit cannot be larger or equal to the largest allowed value');
    }
    if (limit < this._min) {
      throw new RangeError('limit cannot be smaller than the smallest allowed value');
    }
    const obj = this.clone();
    obj._greater = limit;
    obj._func.push(checksize(limit, 'larger than', size => size > limit));
    return obj;
  }

  /**
   * Specifies that the value must be lesser than the limit.
   */
  lesser(limit: number) {
    if (limit <= this._min || limit <= this._greater) {
      throw new RangeError('limit cannot be smaller or equal to the smallest allowed value');
    }
    if (limit > this._max) {
      throw new RangeError('limit cannot be larger than the largest allowed value');
    }
    const obj = this.clone();
    obj._lesser = limit;
    obj._func.push(checksize(limit, 'smaller than', size => size < limit));
    return obj;
  }

  /**
   * Requires the number to be an integer from -(2^31) and 2^31 - 1.
   * As per the GraphQL Spec, Integers are only treated as valid when a valid
   * 32-bit signed integer, providing the broadest support across platforms.
   */
  integer() {
    const obj = this.clone();
    obj._isInt = true;
    return obj;
  }

  /**
   * Specifies the maximum number of decimal places allowed.
   */
  precision(limit: number) {
    if (!Number.isInteger(limit) || limit <= 0) {
      throw new Error('limit must be a positive integer');
    }
    const obj = this.clone();
    obj._func.push((value) => {
      const places = value.toString().match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
      const decimals = Math.max((places[1] ? places[1].length : 0) - (places[2] ? parseInt(places[2], 10) : 0), 0);
      if (decimals <= limit) {
        return value;
      }
      throw new TypeError(`Number is limited to ${limit} decimal places`);
    });
    return obj;
  }

  /**
   * Specifies that the number must be a multiple of base.
   */
  multiple(base: number) {
    const obj = this.clone();
    obj._func.push((value) => {
      if (value % base === 0) {
        return value;
      }
      throw new TypeError(`Number must be a multiple of ${base}`);
    });
    return obj;
  }

  /**
   * Specifies that the number must be positive (>0).
   */
  positive() {
    return this.greater(0);
  }

  /**
   * Specifies that the number must be negative (<0).
   */
  negative() {
    return this.lesser(0);
  }

  create() {
    const coerce: (value: mixed) => Number = compose([Number, ...this._func]);
    this.serialize = coerce;
    this.parseValue = coerce;
    const kind = this._isInt ? Kind.INT : Kind.FLOAT;
    this.parseLiteral = (ast) => {
      return ast.kind === kind ? coerce(ast.value) : null;
    };
    return super.create();
  }
}

export default NumberScalar;

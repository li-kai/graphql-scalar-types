/* flow */
import { Kind } from 'graphql';
import Base from './base';

function checkLimit(limit: number): void {
  if (!Number.isInteger(limit)) {
    throw new TypeError('limit must be an integer');
  } else if (limit < 0) {
    throw new RangeError('limit must be a positive integer');
  }
}

function checkLength(limit: number, comparator: string, isValidLength: (length: number) => boolean) {
  return (value) => {
    if (isValidLength(value.length)) {
      return value;
    }
    throw new TypeError(`String's length must be ${comparator} ${limit}, got ${value.length}.`);
  };
}

/**
 * String scalar type that takes in string data.
 * By itself, it is essentially the `GraphQLString` type.
 */
class StringScalar extends Base<String, String> {

  _min: number;
  _max: number;
  _len: number;

  constructor(name: string) {
    super(name);
    this._func = [String];
  }

  /**
   * Specifies the minimum number of string characters allowed.
   */
  min(limit: number) {
    checkLimit(limit);
    if (limit > this._max) {
      throw new RangeError('limit cannot be larger than max length');
    } else if (typeof this._len !== 'undefined') {
      throw new RangeError('Minimum length cannot have a exact length');
    }

    const obj = this.clone();
    obj._min = limit;
    obj._func.push(checkLength(limit, 'at least', length => length >= limit));
    return obj;
  }

  /**
   * Specifies the maximum number of string characters allowed.
   */
  max(limit: number) {
    checkLimit(limit);
    if (limit < this._min) {
      throw new RangeError('limit cannot be smaller than min length');
    } else if (typeof this._len !== 'undefined') {
      throw new RangeError('Maximum length cannot have a exact length');
    }

    const obj = this.clone();
    obj._max = limit;
    obj._func.push(checkLength(limit, 'at most', length => length <= limit));
    return obj;
  }

  /**
   * Specifies the exact number of string characters required.
   */
  length(limit: number) {
    checkLimit(limit);
    if (typeof this._min !== 'undefined' || typeof this._max !== 'undefined') {
      throw new RangeError('Exact length cannot have a min or max limit');
    }

    const obj = this.clone();
    obj._len = limit;
    obj._func.push(checkLength(limit, 'exactly', length => length === limit));
    return obj;
  }

  /**
   * Requires the string value to only contain a-z, A-Z, and 0-9.
   */
  alphanum() {
    const obj = this.clone();
    obj._func.push((value) => {
      if (/^[a-zA-Z0-9]+$/.test(value)) {
        return value;
      }
      throw new TypeError('String must only contain alpha-numeric characters,');
    });
    return obj;
  }

  create() {
    const coerce = (value: mixed): String => {
      return this._func.reduce((acc, fn) => fn(acc), value);
    };
    this.serialize = coerce;
    this.parseValue = coerce;
    this.parseLiteral = (ast) => {
      return ast.kind === Kind.STRING ? coerce(ast.value) : null;
    };
    return super.create();
  }
}

export default StringScalar;

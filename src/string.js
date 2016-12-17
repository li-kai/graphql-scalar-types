/* flow */
import { Kind } from 'graphql';
import Base from './base';
import { compose } from './utils';

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
    throw new TypeError(`String's length must be ${comparator} ${limit}, got ${value.length}`);
  };
}

/**
 * String scalar type that represents string data.
 * By itself, it is essentially the `GraphQLString` type.
 */
class StringScalar extends Base<String, String> {

  _min: number;
  _max: number;
  _len: number;

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
   * Specifies the length of the string to be truncated to if it exceeds.
   */
  truncate(limit: number) {
    checkLimit(limit);

    const obj = this.clone();
    obj._func.push(value => value.substring(0, limit));
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
      throw new TypeError('String must only contain alpha-numeric characters');
    });
    return obj;
  }

  /**
   * Requires the string value to be a credit card number.
   */
  creditCard() {
    const obj = this.clone();
    obj._func.push((value) => {
      let i = value.length;
      let sum = 0;
      let mul = 1;

      /* eslint-disable */
      while (i--) {
        const char = value.charAt(i) * mul;
        sum += (char - (char > 9) * 9);
        mul ^= 3;
      }
      /* eslint-enable */

      if ((sum % 10 === 0) && (sum > 0)) {
        return value;
      }
      throw new TypeError('String must be a credit card number');
    });
    return obj;
  }

  /**
   * Requires the string value to match the regex test.
   * @param {RegExp} pattern
   * @param {boolean} [options= { name: '', invert: false }] `name` for regexp pattern and `invert` to disallow pattern instead.
   */
  regex(pattern: RegExp, options: { name: string; invert: boolean } = {}) {
    const isRegExp: boolean = pattern instanceof RegExp;
    if (!isRegExp) {
      throw new TypeError('pattern must be a regex object');
    }

    const isValidFlag: boolean = !options.invert || false;
    const name: string = options.name || '';

    const conditionText: string = isValidFlag ? 'must' : 'must not';
    const obj = this.clone();
    obj._func.push((value) => {
      if (pattern.test(value) === isValidFlag) {
        return value;
      }
      throw new TypeError(`String ${conditionText} match regexp ${name}`);
    });
    return obj;
  }

  /**
   * Replaces the regex matches of the string with the `replacement`. Equivalent to `String.prototype.replace`.
   */
  replace(pattern: RegExp | string, replacement: string) {
    const obj = this.clone();
    obj._func.push((value) => {
      return value.replace(pattern, replacement);
    });
    return obj;
  }

  /**
   * Trims the string.
   */
  trim() {
    const obj = this.clone();
    obj._func.push((value) => {
      return value.trim();
    });
    return obj;
  }

  /**
   *
   */
  uppercase() {
    const obj = this.clone();
    obj._func.push((value) => {
      return value.toLocaleUpperCase();
    });
    return obj;
  }

  /**
   *
   */
  lowercase() {
    const obj = this.clone();
    obj._func.push((value) => {
      return value.toLocaleLowerCase();
    });
    return obj;
  }

  /**
   * Requires the string to be a valid base64 string.
   */
  base64() {
    const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
    return this.regex(base64Regex, { name: 'base64' });
  }

  /**
   * Requires the string to be a valid hexadecimal string.
   */
  hex() {
    const regex = /^[a-f0-9]+$/i;
    return this.regex(regex, { name: 'hexadecimal' });
  }

  create() {
    const validate: (value: String) => String = compose(this._func);
    function coerce(value: mixed): String {
      return validate(String(value));
    }
    this.serialize = coerce;
    this.parseValue = coerce;
    this.parseLiteral = (ast) => {
      return ast.kind === Kind.STRING ? validate(ast.value) : null;
    };
    return super.create();
  }
}

export default StringScalar;

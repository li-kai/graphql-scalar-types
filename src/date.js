/* flow */
import { Kind } from 'graphql';
import Base from './base';
import compose from './utils';

/**
 * String scalar type that takes in string data.
 * By itself, it is essentially the `GraphQLString` type.
 */
class DateScalar extends Base<String, Boolean> {

  create() {
    const coerce: (value: mixed) => Boolean = compose([Boolean, ...this._func]);
    this.serialize = coerce;
    this.parseValue = coerce;
    this.parseLiteral = (ast) => {
      return ast.kind === Kind.BOOLEAN ? coerce(ast.value) : null;
    };
    return super.create();
  }
}

export default DateScalar;

import StringScalar from './string';
import BooleanScalar from './boolean';
import NumberScalar from './number';

export default {
  string: name => new StringScalar(name),
  boolean: name => new BooleanScalar(name),
  number: name => new NumberScalar(name),
};

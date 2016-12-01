/* flow */

/**
 * Functional composition with a 1-ary functions.ß
 * @private
 */
function compose(arr: Array<Function>) {
  return value => arr.reduce((acc, fn) => fn(acc), value);
}

/**
 * Flattens a single layer of arrays.
 * @private
 */
function flatten(arr: Array<any>): Array<any> {
  return Array.prototype.concat.apply([], arr);
}

export { compose, flatten };

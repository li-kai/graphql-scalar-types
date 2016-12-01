/* flow */

export default function compose(arr: Array<Function>) {
  return value => arr.reduce((acc, fn) => fn(acc), value);
}

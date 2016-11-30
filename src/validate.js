/* flow */
import { isValidJSValue, GraphQLInputType } from 'graphql';

/**
 * Given a value and a GraphQL type, determine if the value will be
 * accepted for that type.
 */
export default function (value: mixed, type: GraphQLInputType): Array<string> {
  // todo: simply alias isValidJSValue when GraphQL-js's pr #602 is merged
  try {
    return isValidJSValue(value, type);
  } catch (error) {
    return [error.message];
  }
}

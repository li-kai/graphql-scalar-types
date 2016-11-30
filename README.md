# GraphQL Scalar

GraphQL scalar types for validation of GraphQL objects.

The flexibility of GraphQL means validation for your schemas is possible. GraphQL Scalar allows you to build types easily, similar to libraries like joi.

## Example
```js
import 'GraphQLScalar' from 'graphql-scalar';

export const GraphQLName = GraphQLScalar.string('Name').min(0).max(36);
export const GraphQLAge = GraphQLScalar.number('Age').min(0).max(120);
```

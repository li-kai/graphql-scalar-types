# GraphQL Scalar Types [![Build Status](https://travis-ci.org/li-kai/graphql-scalar-types.svg?branch=master)](https://travis-ci.org/li-kai/graphql-scalar-types) [![Coverage Status](https://coveralls.io/repos/github/li-kai/graphql-scalar-types/badge.svg?branch=master)](https://coveralls.io/github/li-kai/graphql-scalar-types?branch=master)

GraphQL scalar types for validation of GraphQL objects.

The flexibility of GraphQL means validation for your schemas is possible. GraphQL Scalar Types allows you to build types easily using a fluent interface, similar to libraries like Joi.

```bash
npm i graphql-scalar-types
```

## Example

```js
import 'GraphQLScalarTypes' from 'graphql-scalar-types';

export const GraphQLName = GraphQLScalarTypes.string('Name').min(0).max(36).create();
export const GraphQLAge = GraphQLScalarTypes.number('Age').min(0).max(120).create();
```

## API

#### constructor

Constructs a builder with a name for the GraphQLScalar.

**Parameters**

-   `name` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)**

**Examples**

```javascript
const GraphQLStringBuilder = GraphQLScalarTypes.string('Name');
```

```javascript
const GraphQLNumberBuilder = GraphQLScalarTypes.number('Age');
```

```javascript
const GraphQLBooleanBuilder = GraphQLScalarTypes.boolean('SpecialFalsy');
```

#### describe

Gives a description to the GraphQLScalar.

**Parameters**

-   `description` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)**

#### nonNull

Makes the GraphQLScalar reject `null` as a value.

**Parameters**

-   `isNonNull` **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** Default value is true. (optional, default `true`)

#### clone

Clones the builder.

#### create

Generates the GraphQLScalar.

Returns **GraphQLScalarType&lt;TInternal, TExternal>**

### BooleanScalar

**Extends Base**

Boolean scalar type that represents boolean data.
By itself, it is essentially the `GraphQLBoolean` type.

#### truthy

Converts additional values to `true` during serialization.
Accepts a value or an array of values.

**Parameters**

-   `params` **...any**

#### falsy

Converts additional values to `false` during serialization.
Accepts a value or an array of values.

**Parameters**

-   `params` **...any**

### DateScalar

**Extends Base**

String scalar type that takes in string data.
By itself, it is essentially the `GraphQLString` type.

### NumberScalar

**Extends Base**

Number scalar type that represents numerical data.
By itself, it is essentially the `GraphQLFloat` type.

#### min

Specifies the minimum number allowed (inclusive).

**Parameters**

-   `limit` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)**

#### max

Specifies the maximum number allowed (inclusive).

**Parameters**

-   `limit` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)**

#### greater

Specifies that the value must be greater than the limit.

**Parameters**

-   `limit` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)**

#### lesser

Specifies that the value must be lesser than the limit.

**Parameters**

-   `limit` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)**

#### integer

Requires the number to be an integer from -(2^31) and 2^31 - 1.
As per the GraphQL Spec, Integers are only treated as valid when a valid
32-bit signed integer, providing the broadest support across platforms.

#### precision

Specifies the maximum number of decimal places allowed.

**Parameters**

-   `limit` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)**

#### multiple

Specifies that the number must be a multiple of base.

**Parameters**

-   `base` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)**

#### positive

Specifies that the number must be positive (>0).

#### negative

Specifies that the number must be negative (&lt;0).

### StringScalar

**Extends Base**

String scalar type that represents string data.
By itself, it is essentially the `GraphQLString` type.

#### min

Specifies the minimum number of string characters allowed.

**Parameters**

-   `limit` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)**

#### max

Specifies the maximum number of string characters allowed.

**Parameters**

-   `limit` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)**

#### length

Specifies the exact number of string characters required.

**Parameters**

-   `limit` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)**

#### truncate

Specifies the length of the string to be truncated to if it exceeds.

**Parameters**

-   `limit` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)**

#### alphanum

Requires the string value to only contain a-z, A-Z, and 0-9.

#### creditCard

Requires the string value to be a credit card number.

#### regex

Requires the string value to match the regex test.

**Parameters**

-   `pattern` **[RegExp](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)**
-   `options` **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** `name` for regexp pattern and `invert` to disallow pattern instead. (optional, default `{name:'',invert:false}`)

#### replace

Replaces the regex matches of the string with the `replacement`. Equivalent to `String.prototype.replace`.

**Parameters**

-   `pattern` **([RegExp](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) \| [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String))**
-   `replacement` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)**

#### trim

Trims the string.

#### uppercase

#### lowercase

#### base64

Requires the string to be a valid base64 string.

#### hex

Requires the string to be a valid hexadecimal string.

### validate

Given a value and a GraphQL type, determine if the value will be
accepted for that type.

**Parameters**

-   `value` **any**
-   `type` **GraphQLInputType**

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>**

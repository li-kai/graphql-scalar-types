module.exports = {
  parser: 'babel-eslint',
  root: true,
  extends: [
    'airbnb-base',
  ],
  env: {
    browser: true,
    node: true,
  },
  globals: {
    expect: true,
    it: true,
  },
  plugins: [
    'import',
  ],
  settings: {
    'import/resolver': {
      webpack: {
        config: 'webpack.config.js',
      },
    },
  },
  rules: {
    'arrow-body-style': 'off',
    'arrow-parens': ['error', 'as-needed', { requireForBlockBody: true }],
    'import/extensions': ['error', 'always',
      {
        js: 'never',
      }
    ],
    'linebreak-style': 'off',
    'max-len': ['error', 120, { "ignoreComments": true }],
    'no-underscore-dangle': 'off',
    'no-duplicate-imports': 'off',
  },
};

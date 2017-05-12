module.exports = {
  coverageDirectory: 'coverage',
  moduleNameMapper: {
    '^.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|bmp|ico|yml)$': '<rootDir>/__mocks__/fileMock.js',
    '^.+\\.(css|scss)$': '<rootDir>/__mocks__/styleMock.js',
  },
  modulePaths: [
    '<rootDir>/src',
  ],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.js',
  ],
  testRegex: '(/__tests__/.*\\.test.js)$',
};

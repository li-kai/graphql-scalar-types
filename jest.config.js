module.exports = {
  modulePaths: ["<rootDir>/src"],
  collectCoverageFrom: ["<rootDir>/src/**/*.js"],
  testRegex: "(/__tests__/.*\\.test.js)$", // Only write lcov files in CIs
  coverageReporters: ["text"].concat(process.env.CI ? "lcov" : [])
};

/* eslint-env node */
module.exports = {
  /*
   * The root of your source code, typically /src
   * `<rootDir>` is a token Jest substitutes
   */
  roots: ['<rootDir>/src'],

  testEnvironment: 'jsdom',

  /*
   * Jest transformations -- this adds support for TypeScript
   * using ts-jest
   */
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest',
  },
  /*
   * Test spec file resolution pattern
   * Matches parent folder `__tests__` and filename
   * Should contain `test` or `spec`.
   * TestRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
   */

  // Module file extensions for importing
  moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'node', 'mdx'],

  moduleNameMapper: {
    '\\.svg$': '<rootDir>/.jest/svgrMock.js',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/.jest/fileMock.js',
    '^#src/(.+)$': '<rootDir>/src/$1',
  },
  testFailureExitCode: 0,
  moduleDirectories: ['node_modules', 'src'],
};

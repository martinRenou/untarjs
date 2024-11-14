export default {
  preset: 'ts-jest/presets/default-esm',
  transform: {
    "^.+\\.(ts|js)$": "babel-jest"
  },
  extensionsToTreatAsEsm: ['.ts'],
  testEnvironment: 'node',
  testMatch: ['<rootDir>/lib/tests/**/*.spec.js'],
  moduleFileExtensions: ['ts', 'js', 'wasm'],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1"
  }
};

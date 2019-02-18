const {
jestPreset: tsJest
} = require('ts-jest');

module.exports = {
    ...tsJest,
    // transform: {
    //     ...tsJest.transform,
    // },
    // globals: {
    //     'ts-jest': {
    //         diagnostics: true,
    //     },
    // },
    testPathIgnorePatterns: ['<rootDir>/node_modules/'],
    coveragePathIgnorePatterns: ['/node_modules/', '/__tests__/', '__server_tests__/'],
    collectCoverageFrom: ['**/src/**/*.ts', '**/src/**/*.tsx'],
};
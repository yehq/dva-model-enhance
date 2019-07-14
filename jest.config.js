// const { defaults: tsjPreset } = require('ts-jest/presets');
module.exports = {
    roots: ['__tests__'],
    testPathIgnorePatterns: ['/node_modules/', '__tests__/models/'],
    preset: 'ts-jest',
    // transform: {
    //     // '^.+\\.tsx?$': 'ts-jest',
    //     ...tsjPreset.transform,
    // },
    // testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    globals: {
        'ts-jest': {
            diagnostics: false,
        },
    },
};

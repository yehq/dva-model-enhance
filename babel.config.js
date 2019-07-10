module.exports = {
    presets: [['@babel/preset-env', { targets: { node: 'current' } }], '@babel/preset-typescript'],
    plugins: [
        ['@babel/plugin-transform-runtime'],
        ['@babel/plugin-transform-regenerator'],
        [
            '@babel/plugin-proposal-decorators',
            {
                legacy: true,
            },
        ],
        ['@babel/plugin-proposal-class-properties', { loose: true }],
    ],
};

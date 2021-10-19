module.exports = {
  presets: ['@babel/preset-env'],
  plugins: [
    [
      '@babel/plugin-transform-runtime',
      {
        regenerator: true,
      },
    ],
  ],
  ignore: [
    'build',
    'coverage',
    '**/__mocks__',
    '**/__tests__',
    '**/integration-tests',
    'node_modules',
    'server.js',
  ],
}

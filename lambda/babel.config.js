module.exports = api => {
  const isTest = api.env('test')
  return {
    presets: ['@babel/preset-env'],
    plugins: [
      'babel-plugin-lodash',
      // Do not use transform-inline-environment-variables during
      // Jest tests.
      ...(isTest
        ? []
        : [
            [
              'transform-inline-environment-variables',
              {
                include: ['LAMBDA_TAB_V4_HOST'],
              },
            ],
          ]),
    ],
  }
}

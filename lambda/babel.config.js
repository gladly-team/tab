module.exports = api => {
  const isTest = api.env('test')
  return {
    presets: ['@babel/preset-env'],
    plugins: [
      'babel-plugin-lodash',
      [
        'module-resolver',
        {
          root: ['../'],
          alias: {
            database: '../graphql/database',
          },
        },
      ],
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

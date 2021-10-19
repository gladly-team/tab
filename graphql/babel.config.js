module.exports = {
  presets: ['@babel/preset-env'],
  plugins: [
    [
      '@babel/plugin-transform-runtime',
      {
        regenerator: true,
      },
    ],
    [
      'content-transformer',
      {
        transformers: [
          // Convert import statements ending with ".md" into strings
          {
            file: /\.md$/,
            format: 'string',
          },
        ],
      },
    ],
  ],
}

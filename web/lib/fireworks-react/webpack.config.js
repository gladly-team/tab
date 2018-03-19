const { resolve } = require('path');
const webpack = require('webpack');

module.exports = {
  context: resolve(__dirname, 'src'),

  entry: [
    './Fireworks.js'
    // the entry point of our app
  ],
  output: {
    filename: 'fireworks.bundle.js',
    // the output bundle

    path: resolve(__dirname, 'dist'),

  },

  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
        options: {
          emitError: true
        }
      },
      {
        test: /\.jsx?$/,
        use: [ 'babel-loader', ],
        exclude: /node_modules/
      },
    ],
  }
};
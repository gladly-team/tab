
var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FaviconsWebpackPlugin = require('favicons-webpack-plugin')
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

// Load environment variables from .env file. Suppress warnings using silent
// if this file is missing. dotenv will never modify any environment variables
// that have already been set.
// https://github.com/keithmorris/node-dotenv-extended
require('dotenv-extended').load({
  path: path.join(__dirname, '..', '.env'),
  defaults: path.join(__dirname, '..', '.env.defaults'),
  schema: path.join(__dirname, '..', '.env.schema')
})
var getClientEnvironment = require('./env')
var paths = require('./paths')

const htmlTemplate = new HtmlWebpackPlugin({
  title: 'Tab for a Cause',
  template: paths.appHtml,
  // https://github.com/jantimon/html-webpack-plugin/issues/481#issuecomment-262414169
  chunks: ['vendor', 'prebid', 'ads', 'app'],
  chunksSortMode: function (chunk1, chunk2) {
    var orders = ['vendor', 'prebid', 'ads', 'app']
    var order1 = orders.indexOf(chunk1.names[0])
    var order2 = orders.indexOf(chunk2.names[0])
    if (order1 > order2) {
      return 1
    } else if (order1 < order2) {
      return -1
    } else {
      return 0
    }
  },
  mobile: true,
  inject: false,
  tabAdsEnabled: process.env.REACT_APP_ADS_ENABLED === 'true'
})
const favIcon = new FaviconsWebpackPlugin(paths.appLogo)

let appEntry
appEntry = [
  `webpack-dev-server/client?http://${process.env.HOST}:${process.env.PORT}`,
  'webpack/hot/only-dev-server',
  'react-hot-loader/patch',
  // Include an alternative client for WebpackDevServer. A client's job is to
  // connect to WebpackDevServer by a socket and get notified about changes.
  // When you save a file, the client will either apply hot updates (in case
  // of CSS changes), or refresh the page (in case of JS changes). When you
  // make a syntax error, this client will display a syntax error overlay.
  // Note: instead of the default WebpackDevServer client, we use a custom one
  // to bring better experience for Create React App users. You can replace
  // the line below with these two lines if you prefer the stock client:
  // require.resolve('webpack-dev-server/client') + '?/',
  // require.resolve('webpack/hot/dev-server'),
  // require.resolve('react-dev-utils/webpackHotDevClient'),
  // We ship a few polyfills by default:
  require.resolve('./polyfills'),
  // Finally, this is your app's code:
  paths.appIndexJs
  // We include the app code last so that if there is a runtime error during
  // initialization, it doesn't blow up the WebpackDevServer client, and
  // changing JS code would still trigger a refresh.
]

// Webpack uses `publicPath` to determine where the app is being served from.
// In development, we always serve from the root. This makes config easier.
var publicPath = process.env.PUBLIC_PATH || '/'
// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_PATH%/xyz looks better than %PUBLIC_PATH%xyz.
var publicUrl = ''
// Get environment variables to inject into our app.
var env = getClientEnvironment(publicUrl)

// This is the development configuration.
// It is focused on developer experience and fast rebuilds.
// The production configuration is different and lives in a separate file.
module.exports = {
  // You may want 'eval' instead if you prefer to see the compiled output in DevTools.
  // See the discussion in https://github.com/facebookincubator/create-react-app/issues/343.
  devtool: 'eval-source-map',
  // These are the "entry points" to our application.
  // This means they will be the "root" imports that are included in JS bundle.
  // The first two entry points enable "hot" CSS and auto-refreshes for JS.
  entry: {
    app: appEntry,
    ads: [
      require.resolve('./polyfills'),
      './src/js/ads/ads.js'
    ],
    prebid: paths.prebidJs
  },
  output: {
    // Next line is not used in dev but WebpackDevServer crashes without it:
    path: paths.appBuild,
    // This does not produce a real file. It's just the virtual path that is
    // served by WebpackDevServer in development. This is the JS bundle
    // containing code from all our entry points, and the Webpack runtime.
    filename: '[name].js',
    // This is the URL that app is served from. We use "/" in development.
    publicPath: publicPath,
    sourceMapFilename: '[file].map'
  },
  resolve: {
    // This allows you to set a fallback for where Webpack should look for modules.
    // We placed these paths second because we want `node_modules` to "win"
    // if there are any conflicts. This matches Node resolution mechanism.
    // https://github.com/facebook/create-react-app/issues/253
    modules: ['node_modules'].concat(
      // It is guaranteed to exist because we tweak it in `env.js`
      process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
    ),
    // These are the reasonable defaults supported by the Node ecosystem.
    // We also include JSX as a common component filename extension to support
    // some tools, although we do not recommend using it, see:
    // https://github.com/facebookincubator/create-react-app/issues/290
    extensions: ['.js', '.json', '.jsx'],
    alias: {
      // Support React Native Web
      // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
      'react-native': 'react-native-web',
      'react': paths.reactPath
    }
  },

  module: {
    // First, run the linter.
    // It's important to do this before Babel processes the JS.
    // Unsupported config in webpack 2.0
    // preLoaders: [
    //   {
    //     test: /\.(js|jsx)$/,
    //     loader: 'eslint',
    //     include: paths.appSrc,
    //   }
    // ],
    rules: [
      {
        test: /\.jsx?$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.json$/,
        use: 'json-loader'
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: '[name]__[local]___[hash:base64:5]'
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              // https://github.com/postcss/postcss-loader/issues/164
              // use ident if passing a function
              ident: 'postcss',
              plugins: () => [
                require('precss'),
                require('autoprefixer')
              ]
            }

          }
        ]
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/[hash].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1000,
              name: 'assets/[hash].[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    // https://medium.com/@adamrackis/vendor-and-code-splitting-in-webpack-2-6376358f1923
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.js',
      minChunks (module, count) {
        var context = module.context
        return context && context.indexOf('node_modules') >= 0
      }
    }),
    // Helps understand what's getting included in our final bundle.
    // With this enabled, build the web app and view report.html in
    // the build directory.
    // https://github.com/th0r/webpack-bundle-analyzer
    new BundleAnalyzerPlugin({
      // set to 'static' for analysis or 'disabled' for none
      analyzerMode: 'disabled'
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    // Makes some environment variables available to the JS code, for example:
    // if (process.env.NODE_ENV === 'development') { ... }. See `./env.js`.
    new webpack.DefinePlugin(env),
    htmlTemplate,
    favIcon
  ],
  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
}

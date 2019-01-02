// Grab NODE_ENV and REACT_APP_* environment variables and prepare them to be
// injected into the application via DefinePlugin in Webpack configuration.

var includes = require('lodash/includes')

// TODO: remove
// Our own defined variables we want to include in the build.
var envVars = [
  // 'HOST',
  // 'PORT',
  // 'REACT_APP_WEBSITE_PROTOCOL',
  // 'REACT_APP_WEBSITE_DOMAIN',
  'FIREBASE_API_KEY',
  'FIREBASE_AUTH_DOMAIN',
  'FIREBASE_DATABASE_URL',
  'FIREBASE_PROJECT_ID',
  'WEB_SENTRY_DSN',
  'WEB_SENTRY_DEBUG',
  'WEB_SENTRY_ENABLE_AUTO_BREADCRUMBS',
  'STAGE',
  'GRAPHQL_ENDPOINT',
  'GRAPHQL_PROXY_DOMAIN',
  'GRAPHQL_PROXY_PATH',
  'MOCK_DEV_AUTHENTICATION',
  'ADS_ENABLED',
  'STATIC_FILES_ENDPOINT',
  'FEATURE_FLAG_SEARCH_PAGE_ENABLED'
]

var REACT_APP = /^REACT_APP_/i

function getClientEnvironment (publicUrl) {
  var processEnv = Object
    .keys(process.env)
    .filter((key) => {
      return REACT_APP.test(key) || includes(envVars, key)
    })
    .reduce((env, key) => {
      env[key] = JSON.stringify(process.env[key])
      return env
    }, {
      // Useful for determining whether we’re running in production mode.
      // Most importantly, it switches React into the correct mode.
      'NODE_ENV': JSON.stringify(
        process.env.NODE_ENV || 'development'
      ),
      // Useful for resolving the correct path to static assets in `public`.
      // For example, <img src={process.env.PUBLIC_URL + '/img/logo.png'} />.
      // This should only be used as an escape hatch. Normally you would put
      // images into the `src` and `import` them in code to get their paths.
      'PUBLIC_URL': JSON.stringify(publicUrl)
    })
  return {'process.env': processEnv}
}

module.exports = getClientEnvironment

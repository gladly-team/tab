
// Used to assign stage-specific env vars in our CI setup
// to the env var names used in app code.
// For example, in the "dev" stage, we assign the value of
// process.env.DEV_WEB_HOST to process.env.WEB_HOST.

// All env vars we want to pick up from the CI environment.
// Set key "optional: true" if the env var does not need
// to be set in all environments.
export const envVars = [
  { name: 'NODE_ENV' },
  { name: 'STAGE' },
  { name: 'AWS_REGION' },
  { name: 'AWS_ACCOUNT_ID' },
  { name: 'LOG_LEVEL' },
  // Web app
  { name: 'HOST', optional: true },
  { name: 'PORT', optional: true },
  { name: 'PUBLIC_PATH' },
  { name: 'REACT_APP_WEBSITE_DOMAIN' },
  { name: 'REACT_APP_WEBSITE_PROTOCOL' },
  { name: 'GRAPHQL_ENDPOINT' },
  { name: 'STATIC_FILES_ENDPOINT' },
  { name: 'CLOUDFRONT_DOMAIN_ALIAS' },
  { name: 'ADS_ENABLED' },
  { name: 'REACT_APP_FIREBASE_API_KEY' },
  { name: 'REACT_APP_FIREBASE_AUTH_DOMAIN' },
  { name: 'REACT_APP_FIREBASE_DATABASE_URL' },
  { name: 'REACT_APP_FIREBASE_PROJECT_ID' },
  { name: 'REACT_APP_SENTRY_DSN' },
  { name: 'REACT_APP_SENTRY_DEBUG', optional: true },
  { name: 'REACT_APP_SENTRY_ENABLE_AUTO_BREADCRUMBS', optional: true },
  { name: 'FEATURE_FLAG_SEARCH_PAGE_ENABLED', optional: true },
  // Media
  { name: 'CLOUDFRONT_MEDIA_DOMAIN_ALIAS' },
  // GraphQL / Lambda
  { name: 'TABLE_NAME_APPENDIX' },
  { name: 'GRAPHQL_PORT', optional: true },
  { name: 'LOGGER' },
  { name: 'SENTRY_PUBLIC_KEY' },
  { name: 'SENTRY_PROJECT_ID' },
  { name: 'SENTRY_PRIVATE_KEY' },
  { name: 'FIREBASE_CLIENT_EMAIL' },
  { name: 'MIGRATION_ADMIN_KEY' }, // TODO: remove after migration
  // Endpoints
  { name: 'GRAPHQL_PROXY_DOMAIN' },
  { name: 'GRAPHQL_PROXY_PATH' },
  { name: 'DYNAMODB_ENDPOINT' },
  { name: 'MEDIA_ENDPOINT' },
  // Deployment
  { name: 'WEB_S3_BUCKET_NAME' },
  { name: 'WEB_S3_BUCKET_PATH' },
  { name: 'MEDIA_S3_BUCKET_NAME' },
  { name: 'WEB_LANDING_PAGE_DOMAIN' },
  // Secrets
  { name: 'AWS_ACCESS_KEY_ID' },
  { name: 'AWS_SECRET_ACCESS_KEY' },
  // Selenium Driver
  { name: 'SELENIUM_DRIVER_TYPE', optional: true },
  { name: 'SELENIUM_HOST', optional: true },
  { name: 'BROWSERSTACK_USER', optional: true },
  { name: 'BROWSERSTACK_KEY', optional: true }
]

// Expect one argument, the stage name.
const assignEnvVars = function (stageName, allEnvVarsRequired = true) {
  // Using the name of the stage, assign the stage-specific
  // value to the environment value name.
  const stageNameUppercase = stageName ? stageName.toUpperCase() : ''
  const stagePrefix = stageNameUppercase ? `${stageNameUppercase}_` : ''
  envVars.forEach((envVar) => {
    const envVarName = envVar.name

    // Delete the existing env var so that any undefined,
    // optional stage-specific env vars remain undefined.
    delete process.env[envVarName]

    let stageEnvVarName = `${stagePrefix}${envVarName}`
    let stageEnvVar = process.env[stageEnvVarName]

    if (typeof stageEnvVar === 'undefined' || stageEnvVar === null) {
      // If the env var is optional and unset, log the info.
      // If the env var is required and unset, optionally throw an error.
      if (envVar.optional) {
        console.info(`Optional environment variable ${envVarName} is not set.`)
      } else if (allEnvVarsRequired) {
        throw new Error(`Environment variable ${stageEnvVarName} must be set.`)
      }
    } else {
      process.env[envVarName] = stageEnvVar
    }
  })
}

export default assignEnvVars

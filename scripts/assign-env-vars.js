// Used to assign stage-specific env vars in our CI setup
// to the env var names used in app code.
// For example, in the "dev" stage, we assign the value of
// process.env.DEV_WEB_HOST to process.env.WEB_HOST.

// All env vars we want to pick up from the CI environment.
// Set key "optional: true" if the env var does not need
// to be set in all environments.
export const envVars = [
  { name: 'NODE_ENV' },
  { name: 'AWS_REGION' },
  { name: 'AWS_ACCOUNT_ID' },
  { name: 'LOG_LEVEL' },
  // Web app
  { name: 'REACT_APP_WEBSITE_DOMAIN' },
  { name: 'REACT_APP_WEBSITE_PROTOCOL' },
  { name: 'REACT_APP_GRAPHQL_ENDPOINT' },
  { name: 'REACT_APP_ADS_ENABLED' },
  { name: 'REACT_APP_CMP_ENABLED' },
  { name: 'REACT_APP_FIREBASE_API_KEY' },
  { name: 'REACT_APP_FIREBASE_AUTH_DOMAIN' },
  { name: 'REACT_APP_FIREBASE_DATABASE_URL' },
  { name: 'REACT_APP_FIREBASE_PROJECT_ID' },
  { name: 'REACT_APP_SENTRY_STAGE' },
  { name: 'REACT_APP_SENTRY_DSN' },
  { name: 'REACT_APP_SENTRY_DEBUG', optional: true },
  { name: 'REACT_APP_SENTRY_ENABLE_AUTO_BREADCRUMBS', optional: true },
  { name: 'REACT_APP_FEATURE_FLAG_SEARCH_PAGE_ENABLED', optional: true },
  { name: 'REACT_APP_MOCK_SEARCH_RESULTS', optional: true },
  {
    name: 'REACT_APP_FEATURE_FLAG_REDIRECT_SEARCH_TO_THIRD_PARTY',
    optional: true,
  },
  { name: 'REACT_APP_SEARCH_PROVIDER', optional: true },
  { name: 'REACT_APP_SEARCH_QUERY_ENDPOINT' },
  { name: 'REACT_APP_SEARCH_QUERY_ENDPOINT_CODEFUEL' },
  { name: 'REACT_APP_FEATURE_FLAG_BING_JS_ADS' },
  { name: 'REACT_APP_FEATURE_FLAG_BING_JS_ADS_PRODUCTION_MODE' },
  { name: 'REACT_APP_MEASURE_TIME_TO_INTERACTIVE', optional: true },
  { name: 'REACT_APP_SHOW_DEMOS_PAGE', optional: true },
  { name: 'REACT_APP_GAM_DEV_ENVIRONMENT', optional: true },
  // GraphQL / Lambda
  { name: 'GQL_LOGGER' },
  { name: 'E2E_MISSIONS_TEST_TAB_GOAL', optional: true },
  { name: 'GQL_SENTRY_PUBLIC_KEY' },
  { name: 'GQL_SENTRY_PROJECT_ID' },
  { name: 'SENTRY_PRIVATE_KEY' },
  { name: 'GQL_SENTRY_STAGE' },
  { name: 'LAMBDA_FIREBASE_DATABASE_URL' },
  { name: 'LAMBDA_FIREBASE_PROJECT_ID' },
  { name: 'LAMBDA_FIREBASE_CLIENT_EMAIL' },
  { name: 'EST_MONEY_RAISED_PER_TAB' },
  { name: 'LAMBDA_TAB_V4_HOST' },
  { name: 'GROWTHBOOK_ENV' },
  { name: 'GQL_SEARCH_ENDPOINT' },
  // Endpoints, shared among services
  { name: 'DYNAMODB_ENDPOINT' },
  { name: 'MEDIA_ENDPOINT' },
  { name: 'DB_TABLE_NAME_APPENDIX' },
  // Deployment
  { name: 'DEPLOYMENT_WEB_APP_CLOUDFRONT_DOMAIN_ALIAS' },
  { name: 'DEPLOYMENT_WEB_APP_S3_BUCKET_NAME' },
  { name: 'DEPLOYMENT_WEB_APP_S3_BUCKET_PATH' },
  { name: 'DEPLOYMENT_WEB_APP_PUBLIC_URL' }, // Assigned to PUBLIC_URL during build
  { name: 'DEPLOYMENT_SEARCH_APP_S3_BUCKET_NAME' },
  { name: 'DEPLOYMENT_SEARCH_APP_S3_BUCKET_PATH' },
  { name: 'DEPLOYMENT_SEARCH_APP_PUBLIC_URL' }, // Assigned to PUBLIC_URL during build
  { name: 'DEPLOYMENT_WEB_APP_LAMBDA_EDGE_FUNCTION_VERSION' },
  { name: 'DEPLOYMENT_SEARCH_APP_LAMBDA_EDGE_FUNCTION_VERSION' },
  { name: 'DEPLOYMENT_HOMEPAGE_404_LAMBDA_EDGE_FUNCTION_VERSION' },
  { name: 'DEPLOYMENT_MEDIA_S3_BUCKET_NAME' },
  { name: 'DEPLOYMENT_MEDIA_CLOUDFRONT_DOMAIN_ALIAS' },
  { name: 'DEPLOYMENT_LANDING_PAGE_DOMAIN' },
  { name: 'DEPLOYMENT_GRAPHQL_DOMAIN' },
  { name: 'DEPLOYMENT_GRAPHQL_PATH' },
  { name: 'DEPLOYMENT_SEARCH_API_ORIGIN_DOMAIN' },
  // End-to-end testing
  { name: 'SELENIUM_DRIVER_TYPE', optional: true },
  { name: 'SELENIUM_HOST', optional: true },
  { name: 'BROWSERSTACK_USER', optional: true },
  { name: 'BROWSERSTACK_KEY', optional: true },
  // Upstash/Redis
  { name: 'UPSTASH_HOST' },
  { name: 'UPSTASH_PASSWORD' },
]

// Expect one argument, the stage name.
const assignEnvVars = (stageName, allEnvVarsRequired = true) => {
  // Using the name of the stage, assign the stage-specific
  // value to the environment value name.
  const stageNameUppercase = stageName ? stageName.toUpperCase() : ''
  const stagePrefix = stageNameUppercase ? `${stageNameUppercase}_` : ''
  envVars.forEach((envVar) => {
    const envVarName = envVar.name

    // Delete the existing env var so that any undefined,
    // optional stage-specific env vars remain undefined.
    delete process.env[envVarName]

    const stageEnvVarName = `${stagePrefix}${envVarName}`
    const stageEnvVar = process.env[stageEnvVarName]

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

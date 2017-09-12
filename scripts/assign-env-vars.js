
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
  // AWS Cognito
  { name: 'COGNITO_REGION' },
  { name: 'COGNITO_IDENTITYPOOLID' },
  { name: 'COGNITO_USERPOOLID' },
  { name: 'COGNITO_CLIENTID' },
  { name: 'MOCK_DEV_AUTHENTICATION' },
  // Web app
  { name: 'PUBLIC_PATH' },
  { name: 'ADS_ENABLED' },
  { name: 'WEB_HOST', optional: true },
  { name: 'WEB_PORT', optional: true },
  // GraphQL
  { name: 'TABLE_NAME_APPENDIX' },
  { name: 'GRAPHQL_PORT', optional: true },
  { name: 'LOGGER' },
  { name: 'SENTRY_PUBLIC_KEY' },
  { name: 'SENTRY_PROJECT_ID' },
  { name: 'SENTRY_PRIVATE_KEY' },
  // Endpoints
  { name: 'GRAPHQL_ENDPOINT' },
  { name: 'DYNAMODB_ENDPOINT' },
  { name: 'MEDIA_ENDPOINT' },
  // Deployment
  { name: 'WEB_S3_BUCKET_NAME' },
  { name: 'MEDIA_S3_BUCKET_NAME' },
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

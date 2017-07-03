
// Used to assign stage-specific env vars in our CI setup
// to the env var names used in app code.
// For example, in the "dev" stage, we assign the value of
// process.envDEV_WEB_HOST to process.env.WEB_HOST.

// All env vars we want to pick up from the CI environment.
export const envVars = [
  'NODE_ENV',
  'AWS_REGION',
  // AWS Cognito
  'COGNITO_REGION',
  'COGNITO_IDENTITYPOOLID',
  'COGNITO_USERPOOLID',
  'COGNITO_CLIENTID',
  // Web app
  'PUBLIC_PATH',
  'WEB_HOST',
  'WEB_PORT',
  // GraphQL
  'TABLE_NAME_APPENDIX',
  // 'GRAPHQL_PORT', // optional
  // Endpoints
  'GRAPHQL_ENDPOINT',
  'DYNAMODB_ENDPOINT',
  'S3_ENDPOINT',
  // Deployment
  'WEB_S3_BUCKET_NAME',
  'MEDIA_S3_BUCKET_NAME',
  // Secrets
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  // Selenium Driver
  'SELENIUM_DRIVER_TYPE'
]

// Expect one argument, the stage name.
const assignEnvVars = function (stageName, allEnvVarsRequired = true) {
  // Using the name of the stage, assign the stage-specific
  // value to the environment value name.
  const stageNameUppercase = stageName ? stageName.toUpperCase() : ''
  const stagePrefix = stageNameUppercase ? `${stageNameUppercase}_` : ''
  envVars.forEach((envVar) => {
    let stageEnvVarName = `${stagePrefix}${envVar}`
    let stageEnvVar = process.env[stageEnvVarName]

    if (typeof stageEnvVar === 'undefined' || stageEnvVar === null) {
      // Optionally throw an error if an env variable is not set.
      if (allEnvVarsRequired) {
        throw new Error(`Environment variable ${stageEnvVarName} must be set.`)
      }
    } else {
      process.env[envVar] = stageEnvVar
    }
  })
}

export default assignEnvVars

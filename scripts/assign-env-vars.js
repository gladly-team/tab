
// Used to assign stage-specific env vars in our CI setup
// to the env var names used in app code.

// All env vars we want to pick up from the CI environment.
const envVars = [
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
  'GRAPHQL_PORT',
  // Endpoints
  'GRAPHQL_ENDPOINT',
  'DYNAMODB_ENDPOINT',
  'S3_ENDPOINT',
  // Secrets
];

// Expect one argument, the stage name.
const assignEnvVars = function(stageName) {

  // Using the name of the stage, assign the stage-specific
  // value to the environment value name.
  const stageNameUppercase = stageName ? stageName.toUpperCase() : '';
  const stagePrefix = stageNameUppercase ? `${stageNameUppercase}_` : '';
  envVars.forEach((envVar) => {
    let stageEnvVar = `${stagePrefix}${envVar}`
    process.env[envVar] = process.env[stageEnvVar];
  });
}

module.exports = assignEnvVars;

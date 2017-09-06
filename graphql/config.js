
// Load environment variables from .env file.
// https://github.com/keithmorris/node-dotenv-extended
require('dotenv-extended').load()

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

module.exports = {
  NODE_ENV: process.env.NODE_ENV,
  AWS_REGION: process.env.AWS_REGION,
  DYNAMODB_ENDPOINT: process.env.DYNAMODB_ENDPOINT,
  COGNITO_USERPOOLID: process.env.COGNITO_USERPOOLID,
  COGNITO_CLIENTID: process.env.COGNITO_CLIENTID,
  S3_ENDPOINT: process.env.S3_ENDPOINT,
  GRAPHQL_PORT: process.env.GRAPHQL_PORT,
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
  ENABLE_GRAPHIQL: process.env.ENABLE_GRAPHIQL === '1',
  TABLE_NAME_APPENDIX: process.env.TABLE_NAME_APPENDIX,
  SENTRY_DSN: process.env.SENTRY_DSN,
  USE_SENTRY: process.env.USE_SENTRY === '1'
}

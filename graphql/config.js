
// Load environment variables from .env file.
// https://github.com/keithmorris/node-dotenv-extended
require('dotenv-extended').load()

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

module.exports = {
  NODE_ENV: process.env.NODE_ENV,
  AWS_REGION: process.env.AWS_REGION,
  DYNAMODB_ENDPOINT: process.env.DYNAMODB_ENDPOINT,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  S3_ENDPOINT: process.env.S3_ENDPOINT,
  GRAPHQL_PORT: process.env.GRAPHQL_PORT,
  LOGGING_ENABLED: process.env.LOGGING_ENABLED === '1',
  ENABLE_GRAPHIQL: process.env.ENABLE_GRAPHIQL === '1',
  TABLE_NAME_APPENDIX: process.env.TABLE_NAME_APPENDIX
}

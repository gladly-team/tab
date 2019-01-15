var path = require('path')

// Load environment variables from .env file.
// https://github.com/keithmorris/node-dotenv-extended
require('dotenv-extended').load({
  path: path.join(__dirname, '.env.local'),
  defaults: path.join(__dirname, '.env'),
})

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

module.exports = {
  NODE_ENV: process.env.NODE_ENV,
  AWS_REGION: process.env.AWS_REGION,
  DYNAMODB_ENDPOINT: process.env.DYNAMODB_ENDPOINT,
  DB_TABLE_NAME_APPENDIX: process.env.DB_TABLE_NAME_APPENDIX,
  MEDIA_ENDPOINT: process.env.MEDIA_ENDPOINT,
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
  LOGGER: process.env.GQL_LOGGER || 'console',
  SENTRY_PUBLIC_KEY: process.env.GQL_SENTRY_PUBLIC_KEY,
  SENTRY_PRIVATE_KEY: process.env.SENTRY_PRIVATE_KEY,
  SENTRY_PROJECT_ID: process.env.GQL_SENTRY_PROJECT_ID,
  SENTRY_STAGE: process.env.GQL_SENTRY_STAGE,
}

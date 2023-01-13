const path = require('path')

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
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  TRUEX_APPLICATION_SECRET: process.env.TRUEX_APPLICATION_SECRET,
  E2E_MISSIONS_TEST_TAB_GOAL: process.env.E2E_MISSIONS_TEST_TAB_GOAL,
  GROWTHBOOK_ENV: process.env.GROWTHBOOK_ENV,
  SEARCH_ENDPOINT: process.env.GQL_SEARCH_ENDPOINT,
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
}

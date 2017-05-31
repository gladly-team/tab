var AWS = require('aws-sdk');

// Load environment variables from .env file.
require('dotenv-extended').load();

AWS.config.update({
  region: process.env.AWS_REGION,
  endpoint: process.env.DYNAMODB_ENDPOINT,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY
});

module.exports = AWS;

var path = require("path");
var AWS = require("aws-sdk");

// Load environment variables from .env file.
require("dotenv-extended").load({
  path: path.join(__dirname, ".env.local"),
  defaults: path.join(__dirname, ".env")
});

AWS.config.update({
  region: process.env.AWS_REGION,
  endpoint: process.env.DYNAMODB_ENDPOINT,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

module.exports = AWS;

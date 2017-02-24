var AWS = require('aws-sdk');

AWS.config.update({
  region: 'us-west-2',
  endpoint: 'http://localhost:8000',
  accessKeyId: 'fakeKey123',
  secretAccessKey: 'fakeSecretKey456'
});

module.exports = AWS;

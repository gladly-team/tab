'use strict';

const serverless_handler = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'User {UserName} has {NumHearts} hearts!',
      input: event,
    }),
  };

  callback(null, response);
};


module.exports = {
  serverless_handler: serverless_handler,
}

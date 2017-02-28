'use strict';

// TODO
const handler = (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: `Sent email.` }),
  };
};

const serverlessHandler = (event, context, callback) => {
  handler(event)
    .then( response => callback(null, response) );
}

module.exports = {
  handler: handler,
  serverlessHandler: serverlessHandler,
}

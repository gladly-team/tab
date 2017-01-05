'use strict'; // eslint-disable-line strict

const handle = require('./graphql/index').default;

module.exports.graphql = (event, context, callback) => {
  let body = JSON.parse(event.body);
  handle(body.query, event.body.variables)
    .then((response) => {
      let lambdaResponse = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin" : "*" // Required for CORS
        },
        body: JSON.stringify(response),
      };
      callback(null, lambdaResponse);
    })
    .catch((error) => callback(error));
};

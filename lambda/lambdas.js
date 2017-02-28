// This file gets all lambda functions from the Serverless
// config and exports the handlers and endpoint info.

import YAML from 'yamljs';
import { has, filter } from 'lodash';

// Get our lambda functions from the Serverless config.
// Return objects that include the handler function for
// each endpoint.
function getLambdas() {
  const serverlessConfig = YAML.load('./serverless.yml');
  const lambdaFunctions = [];
  if (serverlessConfig['functions']) {
    const lambdas = serverlessConfig['functions'];

    for (const key in lambdas) {
      let lambda = lambdas[key];

      // Only set up functions triggered by HTTP GET and POST events.
      lambda.events.forEach((event) => {
        let isHttpEvent = (
            has(event, 'http.path') &&
            (event.http.method === 'get' || event.http.method === 'post'));
        if (isHttpEvent) {
          let handlerModulePath = './' + key + '/' + key;
          lambdaFunctions.push({
            name: key,
            path: event.http.path,
            httpMethod: event.http.method,
            handler: require(handlerModulePath).handler,
          });
        }
      });
    };
  }
  return lambdaFunctions;
}

module.exports = getLambdas;

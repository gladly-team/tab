// This file gets all lambda functions from the Serverless
// config and exports the handlers and endpoint info.

import {clean} from 'require-clean';
import YAML from 'yamljs';

// Get our lambda functions from the Serverless config.
// Return objects that include the handler function for
// each endpoint.
function getLambdaFunctions() {
  const serverlessConfig = YAML.load('./serverless.yml');
  const lambdaFunctions= []
  if (serverlessConfig['functions']) {
    const lambdas = serverlessConfig['functions'];
    Object.keys(lambdas).forEach((key) => {
      let handlerModulePath = './' + key + '/' + key;
      clean(handlerModulePath); // FIXME
      lambdaFunctions.push({
        name: key,
        handler: require(handlerModulePath).handler,
      });
    });
  }
  console.log('Lambda functions: ', lambdaFunctions);
  return lambdaFunctions;
}

module.exports = getLambdaFunctions();

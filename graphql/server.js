import chokidar from 'chokidar';
import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import graphQLHTTP from 'express-graphql';
import path from 'path';
import {clean} from 'require-clean';
import {exec} from 'child_process';

import config from './config';
import { handler } from './handler';

const GRAPHQL_PORT = config.GRAPHQL_PORT;

let graphQLServer;

// Approximate an AWS Lambda event object from the request.
// https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-set-up-simple-proxy.html#api-gateway-simple-proxy-for-lambda-input-format
// 
// {
//     "resource": "Resource path",
//     "path": "Path parameter",
//     "httpMethod": "Incoming request's method name"
//     "headers": {Incoming request headers}
//     "queryStringParameters": {query string parameters }
//     "pathParameters":  {path parameters}
//     "stageVariables": {Applicable stage variables}
//     "requestContext": {Request context, including authorizer-returned key-value pairs}
//     "body": "A JSON string of the request payload."
//     "isBase64Encoded": "A boolean flag to indicate if the applicable request payload is Base64-encode"
// }
function generateLambdaEventObj(req) {
  return {
    resource: '',
    path: req.baseUrl,
    httpMethod: req.method,
    headers: req.headers,
    queryStringParameters: req.query,
    pathParameters: {},
    stageVariables: {},
    requestContext: {},
    body: JSON.stringify(req.body),
    isBase64Encoded: false,
  }
}

function startGraphQLServer(callback) {
  clean('./data/schema');
  const {Schema} = require('./data/schema');
  const graphQLApp = express();
  graphQLApp.use(cors());
  graphQLApp.use(bodyParser.json());
  graphQLApp.use(bodyParser.urlencoded({ extended: true }));


  // TODO: flag to use express-graphql in development
  // graphQLApp.use('/', graphQLHTTP({
  //   graphiql: true,
  //   pretty: true,
  //   schema: Schema,
  // }));

  graphQLApp.post('/', (req, res) => {
    const event = generateLambdaEventObj(req);
    handler(event)
      // Use only the body (the rest is for use within an AWS Lambda context)
      .then(response => res.send(response.body));
  });

  graphQLServer = graphQLApp.listen(GRAPHQL_PORT, () => {
    console.log(
      `GraphQL server is now running on http://localhost:${GRAPHQL_PORT}`
    );
    if (callback) {
      callback();
    }
  });
}

function startServer(callback) {

  // Shut down the server
  if (graphQLServer) {
    graphQLServer.close();
  }

  // Compile the schema
  exec('npm run update-schema', (error, stdout) => {
    console.log(stdout);
    function handleTaskDone() {
      if (callback) {
        callback();
      }
    }
    startGraphQLServer(handleTaskDone);
  });
}

// Watch for DB or schema changes.
const watcher = chokidar.watch([
  './data/{schema}.js', 
  './database/*.js',
  './database/*/*.js']);

watcher.on('change', path => {
  console.log(`\`${path}\` changed. Restarting.`);
  startServer(() =>
    console.log('GraphQL server schema updated.')
  );
});

startServer();


import path from 'path';
import {exec} from 'child_process';

import cors from 'cors';
import express from 'express';

import getLambdas from './lambdas';

// Load environment variables from .env file.
// https://github.com/keithmorris/node-dotenv-extended
require('dotenv-extended').load();

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const LAMBDA_PORT = process.env.LAMBDA_PORT;

let appServer;

function startServer(callback) {

  // Shut down the server if it's running.
  if (appServer) {
    appServer.close();
  }

  const app = express();
  app.use(cors());

  // Set endpoints for lambda functions.
  const lambdas = getLambdas();
  lambdas.forEach((lambda) => {
    if (lambda.httpMethod === 'get') {
      app.get('/' + lambda.path, (req, res) => {
        lambda.handler({ params: req.query})
          .then( response => res.send(response));
      });
      console.log('Set up GET method at /' + lambda.path + ' for service "' + lambda.name + '".');
    } else if (lambda.httpMethod === 'post') {
      app.post('/' + lambda.path, (req, res) => {
        lambda.handler({ params: req.query})
          .then( response => res.send(response));
      });
      console.log('Set up POST method at /' + lambda.path + ' for service "' + lambda.name + '".');
    }
  });

  appServer = app.listen(LAMBDA_PORT, () => {
    console.log(
      `Lambda service is now running on http://localhost:${LAMBDA_PORT}`
    );
    if (callback) {
      callback();
    }
  });
}

startServer();

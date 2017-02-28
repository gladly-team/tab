
import path from 'path';
import {exec} from 'child_process';

import chokidar from 'chokidar';
import cors from 'cors';
import express from 'express';

import getLambdas from './lambdas';

const EXPRESS_PORT = 8001;
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
  console.log(lambdas);

  // TODO: specify get/post
  lambdas.forEach((lambda) => {
    app.get('/' + lambda.name, (req, res) => {
      lambda.handler({ params: req.query})
        .then( response => res.send(response));
    });
  });

  appServer = app.listen(EXPRESS_PORT, () => {
    console.log(
      `Lambda service is now running on http://localhost:${EXPRESS_PORT}`
    );
    if (callback) {
      callback();
    }
  });
}

startServer();

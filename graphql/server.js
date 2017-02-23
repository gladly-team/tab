import chokidar from 'chokidar';
import cors from 'cors';
import express from 'express';
import graphQLHTTP from 'express-graphql';
import path from 'path';
import {clean} from 'require-clean';
import {exec} from 'child_process';

const GRAPHQL_PORT = 8080;

let graphQLServer;

function startGraphQLServer(callback) {
  // Expose a GraphQL endpoint
  clean('./data/schema');
  const {Schema} = require('./data/schema');
  const graphQLApp = express();
  graphQLApp.use(cors());
  graphQLApp.use('/', graphQLHTTP({
    graphiql: true,
    pretty: true,
    schema: Schema,
  }));
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
const watcher = chokidar.watch('./data/{database,schema}.js');
watcher.on('change', path => {
  console.log(`\`${path}\` changed. Restarting.`);
  startServer(() =>
    console.log('GraphQL server schema updated.')
  );
});

startServer();

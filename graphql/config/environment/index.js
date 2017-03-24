/* eslint-disable global-require */
import { extend } from 'lodash';

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  graphql: {
    port: 8080
  }
};

export default extend(config, require(`./${config.env}`).default);

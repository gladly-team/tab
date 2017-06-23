[![Build Status](https://travis-ci.org/gladly-team/tab.svg?branch=master)](https://travis-ci.org/gladly-team/tab)
[![codecov](https://codecov.io/gh/gladly-team/tab/branch/master/graph/badge.svg)](https://codecov.io/gh/gladly-team/tab)
# Tab for a Cause
*Surf the web, save the world.*

## Developing

### Prerequesites
* [Docker Engine](https://docs.docker.com/engine/installation/)
* [Yarn](https://yarnpkg.com/en/)
* If you run into any `node-gyp`-related errors when installing Node packages, download the [`node-gyp` dependencies](https://github.com/nodejs/node-gyp#installation). _Note: `node-gyp` is a dependency of [`asyncawait`](https://github.com/yortus/asyncawait)._

### Getting Started

1. Clone this repository.
2. In the top level directory, run `yarn run build`. This installs dependencies and builds Docker images.
3. Run `yarn start`.
4. On first run, you'll have to create database tables and load fixtures.
    * `cd dynamodb`
    * `yarn run init`

### Development Tips

* The `start` script in the top-level `package.json` orchestrates running services.
* The lambda, graphql, and web services use [dotenv-extended](https://www.npmjs.com/package/dotenv-extended) to manage environment variables. The `.env.defaults` files specify defaults, which you can override with your file named `.env`.

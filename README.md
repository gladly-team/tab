[![Build Status](https://travis-ci.org/gladly-team/tab.svg?branch=master)](https://travis-ci.org/gladly-team/tab)
# Tab for a Cause
*Surf the web, save the world.*

## Developing

### Prerequesites
* [Node.js](https://nodejs.org/en/) 6+
* [Docker Engine](https://docs.docker.com/engine/installation/)
* [Yarn](https://yarnpkg.com/en/)

### Getting Started

1. Clone this repository.
2. In the top level directory, run `npm run build`. This installs dependencies and builds Docker images.
3. Run `npm start`.
4. On first run, you'll have to create database tables and load fixtures.
    * `cd dynamodb`
    * `npm run init`

### Development Tips

* The `start` script in the top-level `package.json` orchestrates running services.

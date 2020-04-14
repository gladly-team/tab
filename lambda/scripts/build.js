/* eslint-disable import/no-extraneous-dependencies */
const path = require('path')
const { spawnSync } = require('child_process')

// Load environment variables from .env file.
// https://github.com/keithmorris/node-dotenv-extended
require('dotenv-extended').load({
  path: path.join(__dirname, '../', '.env.local'),
  defaults: path.join(__dirname, '../', '.env'),
})

process.env.NODE_ENV = 'production'

spawnSync('babel', ['--out-dir=build', './src/'])

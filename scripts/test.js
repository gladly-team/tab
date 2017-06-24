// Used to test in CI.

const spawn = require('child_process').spawn
const assignEnvVars = require('./assign-env-vars')

// Set env vars.
const requireAllEnvVarsSet = false // TODO: set to true for CI
assignEnvVars('dev', requireAllEnvVarsSet)

spawn('yarn', ['run', 'test'], {stdio: 'inherit'})

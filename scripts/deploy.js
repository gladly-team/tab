// Used to deploy from CI.

const assignEnvVars = require('./assign-env-vars')

// Expect one argument, the stage name.
const args = process.argv.slice(2)
const stageName = args[0] ? args[0].toUpperCase() : ''

// Set env vars for this stage.
assignEnvVars(stageName)

// TODO: deploy

// Used to deploy from CI.

import assignEnvVars from './assign-env-vars'
import { checkDeployValidity } from './deployHelpers'

// Expect one argument, the stage name.
const args = process.argv.slice(2)
const stageName = args[0] ? args[0].toUpperCase() : ''

checkDeployValidity(stageName, process.env.CI)

// Set env vars for this stage.
assignEnvVars(stageName)

// TODO: deploy

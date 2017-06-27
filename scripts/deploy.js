// Used to deploy from CI.

import { spawn } from 'child_process'
import assignEnvVars from './assign-env-vars'
import { checkDeployValidity } from './deployHelpers'

// Expect one argument, the stage name.
const args = process.argv.slice(2)
const stageName = args[0] ? args[0].toUpperCase() : ''

console.log(`Using deploy stage "${stageName}".`)
checkDeployValidity(stageName, process.env.CI)

// Set env vars for this stage.
console.log('Assigning environment variables...')
assignEnvVars(stageName)

console.log('Deploying...')

spawn('yarn', ['run', 'ci:deployservices'], {stdio: 'inherit'})

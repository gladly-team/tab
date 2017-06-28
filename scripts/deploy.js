// Used to deploy from CI.

import { spawn } from 'child_process'
import assignEnvVars from './assign-env-vars'
import { checkDeployValidity, getServerlessStageName } from './deployHelpers'

// Expect one argument, the stage name.
const args = process.argv.slice(2)
const stageName = args[0] ? args[0].toUpperCase() : ''

console.log(`Using deploy stage "${stageName}".`)
checkDeployValidity(stageName, process.env.CI)

// Set env vars for this stage.
console.log('Assigning environment variables...')
assignEnvVars(stageName)

// Set env var to the Serverless stage name value.
// Services use the value to determine their deploy stage.
const serverlessStage = getServerlessStageName(stageName)
process.env.SLS_STAGE = serverlessStage
console.log(`Set Serverless stage (SLS_STAGE) to "${serverlessStage}".`)

console.log('Deploying...')
spawn('yarn', ['run', 'ci:deployservices'])

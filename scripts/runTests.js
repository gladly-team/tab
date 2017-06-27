// Used to test in CI.

import { spawn } from 'child_process'
import assignEnvVars from './assign-env-vars'

// Set env vars.
const requireAllEnvVarsSet = true
assignEnvVars('dev', requireAllEnvVarsSet)

spawn('yarn', ['run', 'test'], {stdio: 'inherit'})

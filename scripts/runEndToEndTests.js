// Used to test in CI.

import { spawn } from 'child_process'
import assignEnvVars from './assign-env-vars'

// Set env vars.
assignEnvVars('test')

const tests = spawn('yarn', ['run', 'test-e2e'], {stdio: 'inherit'})

// Exit this process with the child process code.
tests.on('exit', (code) => process.exit(code))

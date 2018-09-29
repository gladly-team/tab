// Used to test in CI.

import { spawn } from "child_process"
import assignEnvVars from "./assign-env-vars"

// Set env vars.
const requireAllEnvVarsSet = true
assignEnvVars("test", requireAllEnvVarsSet)

const tests = spawn("yarn", ["run", "test"], { stdio: "inherit" })

// Exit this process with the child process code.
tests.on("exit", code => process.exit(code))

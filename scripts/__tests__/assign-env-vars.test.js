/* eslint-env jest */

const assignEnvVars = require('../assign-env-vars')

const envVarsUsedInTests = [
  'WEB_HOST',
  'GRAPHQL_ENDPOINT',
  'S3_ENDPOINT'
]

// Store environment variable values at the time we run
// the tests.
const originalEnvVarVals = {}

function storeEnvVars () {
  envVarsUsedInTests.forEach((envVarName) => {
    originalEnvVarVals[envVarName] = process.env[envVarName]
  })
}

// Set environment variable values to their original values.
function restoreEnvVars () {
  envVarsUsedInTests.forEach((envVarName) => {
    process.env[envVarName] = originalEnvVarVals[envVarName]
  })
}

beforeAll(() => {
  storeEnvVars()
})

beforeEach(() => {
  restoreEnvVars()
})

afterAll(() => {
  restoreEnvVars()
})

describe('assign-env-vars script', () => {
  it('fails if a required env var is not set', () => {
    delete process.env.WEB_HOST
    expect(() => {
      assignEnvVars('dev')
    }).toThrow()
  })

  it('optionally does not fail if an env var is not set', () => {
    delete process.env.WEB_HOST
    assignEnvVars('dev', false)
  })
})

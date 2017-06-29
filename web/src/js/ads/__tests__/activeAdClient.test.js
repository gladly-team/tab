/* eslint-env jest */

import { getActiveAdServerName } from '../activeAdClient'

const affectedEnvVars = ['AD_CLIENT_NAME']

// Store environment variables' values prior to running any tests.
const originalEnvVarVals = {}
function storeEnvVars () {
  affectedEnvVars.forEach((envVarName) => {
    originalEnvVarVals[envVarName] = process.env[envVarName]
  })
}

// Reset environment variable values to their original
// (pre-test) values.
function restoreEnvVars () {
  affectedEnvVars.forEach((envVarName) => {
    const envVarVal = originalEnvVarVals[envVarName]

    // If the env var was originally defined, reassign its original
    // value. If it was not defined, delete its value.
    if (typeof envVarVal !== 'undefined' && envVarVal !== null) {
      process.env[envVarName] = envVarVal
    } else {
      delete process.env[envVarName]
    }
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

describe('activeAdClient', () => {
  it('returns "dfp" when set', () => {
    process.env.AD_CLIENT_NAME = 'dfp'
    expect(getActiveAdServerName()).toBe('dfp')
  })

  it('returns "mock" when set', () => {
    process.env.AD_CLIENT_NAME = 'mock'
    expect(getActiveAdServerName()).toBe('mock')
  })

  it('throws an error for a bad env variable setting', () => {
    process.env.AD_CLIENT_NAME = 'boop-y-doop'
    expect(() => {
      getActiveAdServerName()
    }).toThrow()
  })

  it('throws an error when the env variable is not set', () => {
    delete process.env.AD_CLIENT_NAME
    expect(() => {
      getActiveAdServerName()
    }).toThrow()
  })
})

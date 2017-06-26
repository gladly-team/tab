/* eslint-env jest */

import assignEnvVars, { envVars } from '../assign-env-vars'

/**
 * Return duplicates strings in `items` with multiple prefixes.
 * @param {array} items - An array of strings
 * @param {string} prefixes - An array of strings
 * @return {array} An array of strings (each combined value of `items`
 *   prefixed with the values in `prefixes`).
 */
function getPrefixVariants (items, prefixes) {
  const prefixedItems = items.reduce((res, item) => {
    const variants = prefixes.map((prefix) => {
      return `${prefix}${item}`
    })
    return res.concat(variants)
  }, [])
  return prefixedItems
}

// Prefixes to assign to all env vars.
const envVarPrefixes = ['', 'DEV_', 'TEST_', 'STAGING_', 'PROD_']

const allEnvVars = getPrefixVariants(envVars, envVarPrefixes)

// Store environment variable values at the time we run
// the tests.
const originalEnvVarVals = {}

function storeEnvVars () {
  allEnvVars.forEach((envVarName) => {
    originalEnvVarVals[envVarName] = process.env[envVarName]
  })
}

// Set environment variable values to their original values.
function restoreEnvVars () {
  allEnvVars.forEach((envVarName) => {
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

describe('env variable name generation', () => {
  it('uses correct prefixing', () => {
    expect(getPrefixVariants(['A_THING', 'HELLO'], ['', 'PRE_']))
      .toEqual(['A_THING', 'PRE_A_THING', 'HELLO', 'PRE_HELLO'])
  })

  it('returns nothing if no prefixes', () => {
    expect(getPrefixVariants(['A_THING', 'HELLO'], []))
      .toEqual([])
  })

  it('creates expected values in `allEnvVars`', () => {
    const firstEnvName = envVars[0]
    const lastEnvName = envVars[envVars.length - 1]

    // The list of all env vars should contain each env var
    // with each prefix.
    envVarPrefixes.forEach((prefix) => {
      expect(allEnvVars).toContain(`${prefix}${firstEnvName}`)
      expect(allEnvVars).toContain(`${prefix}${lastEnvName}`)
    })
  })
})

describe('assign-env-vars script', () => {
  it('fails if a required env var is not set', () => {
    const envStageName = 'DEV'
    delete process.env.DEV_WEB_HOST
    expect(() => {
      assignEnvVars(envStageName)
    }).toThrow()
  })

  it('optionally does not fail if an env var is not set', () => {
    const envStageName = 'DEV'
    delete process.env.DEV_WEB_HOST
    assignEnvVars(envStageName, false)
  })

  it('does not fail if all env vars are set', () => {
    const envStageName = 'DEV'
    allEnvVars.forEach((envVarName) => {
      process.env[`${envStageName}_${envVarName}`] = 'foo'
    })
    assignEnvVars(envStageName)
  })
})

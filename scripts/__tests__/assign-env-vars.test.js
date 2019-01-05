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
const envVarPrefixes = ['DEV_', 'TEST_', 'STAGING_', 'PROD_']

// Array of env var names (strings).
const envVarNames = envVars.reduce((acc, obj) => {
  acc.push(obj.name)
  return acc
}, [])

// Every combination of prefix and env var names.
// In other words, every environment variable name we'd
// use across all stages.
const allEnvVars = getPrefixVariants(
  envVarNames,
  envVarPrefixes
)

// Store environment variables' values prior to running any tests.
const originalEnvVarVals = {}
function storeEnvVars () {
  allEnvVars.forEach((envVarName) => {
    originalEnvVarVals[envVarName] = process.env[envVarName]
  })
}

// Reset environment variable values to their original
// (pre-test) values.
function restoreEnvVars () {
  allEnvVars.forEach((envVarName) => {
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
  console.info = jest.fn()
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
    const firstEnvName = envVars[0].name
    const lastEnvName = envVars[envVars.length - 1].name

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

    // Assign values to all env vars, then delete one.
    // This ensures test consistency across environments.
    envVarNames.forEach((envVarName) => {
      process.env[`${envStageName}_${envVarName}`] = 'abc'
    })

    // Expects that MEDIA_ENDPOINT is a required env var.
    delete process.env.DEV_MEDIA_ENDPOINT

    expect(() => {
      assignEnvVars(envStageName)
    }).toThrow()
  })

  it('optionally does not fail if a required env var is not set', () => {
    const envStageName = 'DEV'

    // Expects that MEDIA_ENDPOINT is a required env var.
    delete process.env.DEV_MEDIA_ENDPOINT
    assignEnvVars(envStageName, false)
  })

  it('does not fail if an optional env var is not set', () => {
    const envStageName = 'DEV'

    // Assign values to all env vars, then delete one.
    // This ensures test consistency across environments.
    envVarNames.forEach((envVarName) => {
      process.env[`${envStageName}_${envVarName}`] = 'abc'
    })

    // Expects that SELENIUM_DRIVER_TYPE is an optional env var.
    delete process.env.DEV_SELENIUM_DRIVER_TYPE
    assignEnvVars(envStageName)
  })

  it('deletes existing "root" env vars if the stage-specific env var is not set', () => {
    const envStageName = 'DEV'

    // Assign values to all env vars, then delete one.
    // This ensures test consistency across environments.
    envVarNames.forEach((envVarName) => {
      process.env[`${envStageName}_${envVarName}`] = 'abc'
    })

    // Expects that SELENIUM_DRIVER_TYPE is an optional env var.
    delete process.env.DEV_SELENIUM_DRIVER_TYPE

    // This should not be used.
    process.env.SELENIUM_DRIVER_TYPE = 'blah'
    assignEnvVars(envStageName)

    expect(process.env.SELENIUM_DRIVER_TYPE).not.toBeDefined()
  })

  it('does not set an undefined env variable value as "undefined" string', () => {
    const envStageName = 'DEV'
    delete process.env.MEDIA_ENDPOINT
    delete process.env.DEV_MEDIA_ENDPOINT
    assignEnvVars(envStageName, false)
    expect(process.env.MEDIA_ENDPOINT).not.toBeDefined()
  })

  it('does not fail if all env vars are set', () => {
    const envStageName = 'DEV'
    envVarNames.forEach((envVarName) => {
      process.env[`${envStageName}_${envVarName}`] = 'foo'
    })
    assignEnvVars(envStageName)
  })

  it('assigns a stage-specific env value to the root env varible name', () => {
    const envStageName = 'DEV'
    delete process.env.REACT_APP_GRAPHQL_ENDPOINT
    envVarNames.forEach((envVarName) => {
      process.env[`${envStageName}_${envVarName}`] = 'xyz'
    })
    expect(process.env.REACT_APP_GRAPHQL_ENDPOINT).not.toBeDefined()
    assignEnvVars(envStageName)
    expect(process.env.REACT_APP_GRAPHQL_ENDPOINT).toBe('xyz')
  })

  it('ignores the stage name caps when assigning the env varible value', () => {
    delete process.env.REACT_APP_GRAPHQL_ENDPOINT
    envVarNames.forEach((envVarName) => {
      process.env[`STAGING_${envVarName}`] = 'foobar'
    })
    expect(process.env.REACT_APP_GRAPHQL_ENDPOINT).not.toBeDefined()
    assignEnvVars('staging')
    expect(process.env.REACT_APP_GRAPHQL_ENDPOINT).toBe('foobar')
  })

  it('does not assign value to an unlisted env variable name', () => {
    const envStageName = 'STAGING'
    envVarNames.forEach((envVarName) => {
      process.env[`STAGING_${envVarName}`] = 'abc'
    })
    assignEnvVars(envStageName)
    expect(process.env.THIS_VAR_IS_UNUSED).not.toBeDefined()
  })
})

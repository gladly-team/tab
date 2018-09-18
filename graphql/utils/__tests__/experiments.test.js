/* eslint-env jest */

beforeEach(() => {
  // Modify the experiments for testing.
  const experiments = require('../experiments')
  experiments.experimentConfig = {
    anonSignIn: {
      NONE: 0,
      AUTHED_USER_ONLY: 1,
      ANONYMOUS_ALLOWED: 2
    },
    fooTest: {
      NONE: 0,
      SOME_OTHER_GROUP: 1
    },
    anImportantTest: {
      FAIL: 'fail',
      SUCCEED: 'succeed',
      AMBIGUOUS: 'ambiguous'
    }
  }
})

afterEach(() => {
  jest.resetModules()
})

describe('experiments', () => {
  test('returns expected experiment groups when all are valid', () => {
    const getValidatedExperimentGroups = require('../experiments')
      .getValidatedExperimentGroups
    const expGroups = getValidatedExperimentGroups({
      anonSignIn: 1,
      fooTest: 0,
      anImportantTest: 'ambiguous'
    })
    expect(expGroups).toEqual({
      anonSignIn: 1,
      fooTest: 0,
      anImportantTest: 'ambiguous'
    })
  })

  test('returns all null experiment groups when none are provided', () => {
    const getValidatedExperimentGroups = require('../experiments')
      .getValidatedExperimentGroups
    const expGroups = getValidatedExperimentGroups({})
    expect(expGroups).toEqual({
      anonSignIn: null,
      fooTest: null,
      anImportantTest: null
    })
  })

  test('returns a null experiment group value when the group value is invalid', () => {
    const getValidatedExperimentGroups = require('../experiments')
      .getValidatedExperimentGroups
    const expGroups = getValidatedExperimentGroups({
      anonSignIn: 3020,
      fooTest: 1,
      anImportantTest: 'this is invalid!'
    })
    expect(expGroups).toEqual({
      anonSignIn: null,
      fooTest: 1,
      anImportantTest: null
    })
  })

  test('returns all null experiment groups when nothing is provdied', () => {
    const getValidatedExperimentGroups = require('../experiments')
      .getValidatedExperimentGroups
    const expGroups = getValidatedExperimentGroups()
    expect(expGroups).toEqual({
      anonSignIn: null,
      fooTest: null,
      anImportantTest: null
    })
  })

  test('returns an empty object when there are no experiments', () => {
    const experiments = require('../experiments')
    experiments.experimentConfig = {}
    const getValidatedExperimentGroups = require('../experiments')
      .getValidatedExperimentGroups
    const expGroups = getValidatedExperimentGroups({
      anonSignIn: 1,
      fooTest: 0,
      anImportantTest: 'ambiguous'
    })
    expect(expGroups).toEqual({})
  })
})

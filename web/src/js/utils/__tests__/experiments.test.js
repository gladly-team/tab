/* eslint-env jest */

import localStorageMgr, {
  __mockClear
} from 'js/utils/localstorage-mgr'

jest.mock('js/utils/localstorage-mgr')
jest.mock('js/utils/feature-flags')
afterEach(() => {
  __mockClear()
  jest.clearAllMocks()
})

describe('experiments', () => {
  /* Tests for the Experiment and ExperimentGroup objects */

  test('createExperiment returns an object with expected shape', () => {
    const createExperiment = require('js/utils/experiments').createExperiment
    const experiment = createExperiment({
      name: 'fooTest'
    })
    expect(experiment).toMatchObject({
      name: 'fooTest',
      active: false,
      disabled: false,
      groups: {
        NONE: {
          value: 'none',
          schemaValue: 'NONE'
        }
      },
      localStorageKey: 'tab.experiments.fooTest',

      saveTestGroupToLocalStorage: expect.any(Function),
      assignTestGroup: expect.any(Function),
      getTestGroup: expect.any(Function)
    })
  })

  test('returns the "none" test group when the experiment is disabled', () => {
    const { createExperiment, createExperimentGroup } = require('js/utils/experiments')

    // Mock that the user is assigned to an experiment group.
    localStorageMgr.setItem('tab.experiments.fooTest', 'newThing')

    const experiment = createExperiment({
      name: 'fooTest',
      active: true,
      disabled: true,
      groups: {
        MY_CONTROL_GROUP: createExperimentGroup({
          value: 'sameOld',
          schemaValue: 'THE_CONTROL'
        }),
        FUN_EXPERIMENT: createExperimentGroup({
          value: 'newThing',
          schemaValue: 'EXPERIMENT'
        })
      }
    })
    expect(experiment.getTestGroup()).toEqual('none')
  })

  test('returns the experiment test group when the experiment is not disabled', () => {
    const { createExperiment, createExperimentGroup } = require('js/utils/experiments')

    // Mock that the user is assigned to an experimental group.
    localStorageMgr.setItem('tab.experiments.fooTest', 'newThing')

    const experiment = createExperiment({
      name: 'fooTest',
      active: true,
      disabled: false,
      groups: {
        MY_CONTROL_GROUP: createExperimentGroup({
          value: 'sameOld',
          schemaValue: 'THE_CONTROL'
        }),
        FUN_EXPERIMENT: createExperimentGroup({
          value: 'newThing',
          schemaValue: 'EXPERIMENT'
        })
      }
    })
    expect(experiment.getTestGroup()).toEqual('newThing')
  })

  test('returns the "none" test group when the experiment value in local storage is invalid', () => {
    const { createExperiment, createExperimentGroup } = require('js/utils/experiments')

    // Invalid local storage value
    localStorageMgr.setItem('tab.experiments.fooTest', 'not-a-valid-group')

    const experiment = createExperiment({
      name: 'fooTest',
      active: true,
      disabled: false,
      groups: {
        MY_CONTROL_GROUP: createExperimentGroup({
          value: 'sameOld',
          schemaValue: 'THE_CONTROL'
        }),
        FUN_EXPERIMENT: createExperimentGroup({
          value: 'newThing',
          schemaValue: 'EXPERIMENT'
        })
      }
    })
    expect(experiment.getTestGroup()).toEqual('none')
  })

  test('does not assign the user to a test group when the experiment is inactive', () => {
    const { createExperiment, createExperimentGroup } = require('js/utils/experiments')
    const experiment = createExperiment({
      name: 'fooTest',
      active: false,
      disabled: false,
      groups: {
        MY_CONTROL_GROUP: createExperimentGroup({
          value: 'sameOld',
          schemaValue: 'THE_CONTROL'
        }),
        FUN_EXPERIMENT: createExperimentGroup({
          value: 'newThing',
          schemaValue: 'EXPERIMENT'
        })
      }
    })

    // Control for randomness.
    jest.spyOn(Math, 'random').mockReturnValue(0)

    experiment.assignTestGroup()
    expect(localStorageMgr.setItem).not.toHaveBeenCalled()
  })

  test('saves a test group to local storage when assigning a test group', () => {
    const { createExperiment, createExperimentGroup } = require('js/utils/experiments')
    const experiment = createExperiment({
      name: 'fooTest',
      active: true,
      disabled: false,
      groups: {
        MY_CONTROL_GROUP: createExperimentGroup({
          value: 'sameOld',
          schemaValue: 'THE_CONTROL'
        }),
        FUN_EXPERIMENT: createExperimentGroup({
          value: 'newThing',
          schemaValue: 'EXPERIMENT'
        })
      }
    })

    // Control for randomness.
    jest.spyOn(Math, 'random').mockReturnValue(0)

    experiment.assignTestGroup()
    expect(localStorageMgr.setItem)
      .toHaveBeenCalledWith('tab.experiments.fooTest', 'sameOld')
  })

  test('selects from all the test groups when assigning the user to a test group', () => {
    const { createExperiment, createExperimentGroup } = require('js/utils/experiments')
    const experiment = createExperiment({
      name: 'fooTest',
      active: true,
      disabled: false,
      groups: {
        MY_CONTROL_GROUP: createExperimentGroup({
          value: 'sameOld',
          schemaValue: 'THE_CONTROL'
        }),
        FUN_EXPERIMENT: createExperimentGroup({
          value: 'newThing',
          schemaValue: 'EXPERIMENT'
        }),
        CRAZY_EXPERIMENT: createExperimentGroup({
          value: 'crazyThing',
          schemaValue: 'WOWOWOW'
        })
      }
    })

    // Control for randomness, picking the last group value.
    jest.spyOn(Math, 'random').mockReturnValue(0.99)

    experiment.assignTestGroup()
    expect(localStorageMgr.setItem)
      .toHaveBeenCalledWith('tab.experiments.fooTest', 'crazyThing')
  })

  test('assigns the "none" test group when there are no other groups', () => {
    const { createExperiment } = require('js/utils/experiments')
    const experiment = createExperiment({
      name: 'fooTest',
      active: true,
      disabled: false,
      groups: {}
    })

    // Control for randomness.
    jest.spyOn(Math, 'random').mockReturnValue(0)

    experiment.assignTestGroup()
    expect(localStorageMgr.setItem)
      .toHaveBeenCalledWith('tab.experiments.fooTest', 'none')
  })

  /* Tests for active experiments */

  test('assignUserToTestGroups saves the user\'s test groups to localStorage', () => {
    // // Control for randomness.
    // jest.spyOn(Math, 'random').mockReturnValue(0)

    const assignUserToTestGroups = require('js/utils/experiments').assignUserToTestGroups
    assignUserToTestGroups()

    // Placeholder while we do not have any active tests.
    expect(true).toBe(true)
  })
})

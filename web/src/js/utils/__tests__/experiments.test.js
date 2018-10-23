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
/* Tests for the Experiment and ExperimentGroup objects */
describe('Experiment and ExperimentGroup objects', () => {
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

    // Mock that the user is assigned to an experiment group.
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

  // TODO: test validation throws
})

/* Test core functionality with fake experiments */
describe('Main experiments functionality', () => {
  test('getUserExperimentGroup returns the expected value', () => {
    const experimentsExports = require('js/utils/experiments')

    // Mock that the user is assigned to an experiment group.
    localStorageMgr.setItem('tab.experiments.fooTest', 'newThing')

    experimentsExports.experiments = [
      experimentsExports.createExperiment({
        name: 'exampleTest',
        active: true,
        disabled: false,
        groups: {
          SOMETHING: experimentsExports.createExperimentGroup({
            value: 'hi',
            schemaValue: 'SOMETHING'
          }),
          ANOTHER_THING: experimentsExports.createExperimentGroup({
            value: 'bye',
            schemaValue: 'ANOTHER_THING'
          })
        }
      }),
      experimentsExports.createExperiment({
        name: 'fooTest',
        active: true,
        disabled: false,
        groups: {
          MY_CONTROL_GROUP: experimentsExports.createExperimentGroup({
            value: 'sameOld',
            schemaValue: 'THE_CONTROL'
          }),
          FUN_EXPERIMENT: experimentsExports.createExperimentGroup({
            value: 'newThing',
            schemaValue: 'EXPERIMENT'
          })
        }
      })
    ]
    expect(experimentsExports.getUserExperimentGroup('fooTest'))
      .toBe('newThing')
  })

  test('getUserExperimentGroup returns "none" when the experiment does not exist', () => {
    const experimentsExports = require('js/utils/experiments')

    // Mock that the user is assigned to an experiment group.
    localStorageMgr.setItem('tab.experiments.fooTest', 'newThing')

    experimentsExports.experiments = [
      experimentsExports.createExperiment({
        name: 'exampleTest',
        active: true,
        disabled: false,
        groups: {
          SOMETHING: experimentsExports.createExperimentGroup({
            value: 'hi',
            schemaValue: 'SOMETHING'
          }),
          ANOTHER_THING: experimentsExports.createExperimentGroup({
            value: 'bye',
            schemaValue: 'ANOTHER_THING'
          })
        }
      }),
      experimentsExports.createExperiment({
        name: 'fooTest',
        active: true,
        disabled: false,
        groups: {
          MY_CONTROL_GROUP: experimentsExports.createExperimentGroup({
            value: 'sameOld',
            schemaValue: 'THE_CONTROL'
          }),
          FUN_EXPERIMENT: experimentsExports.createExperimentGroup({
            value: 'newThing',
            schemaValue: 'EXPERIMENT'
          })
        }
      })
    ]
    expect(experimentsExports.getUserExperimentGroup('someNonexistentTest'))
      .toBe('none')
  })

  test('getUserExperimentGroup returns "none" when the experiment is disabled', () => {
    const experimentsExports = require('js/utils/experiments')

    // Mock that the user is assigned to an experiment group.
    localStorageMgr.setItem('tab.experiments.fooTest', 'newThing')

    experimentsExports.experiments = [
      experimentsExports.createExperiment({
        name: 'exampleTest',
        active: true,
        disabled: false,
        groups: {
          SOMETHING: experimentsExports.createExperimentGroup({
            value: 'hi',
            schemaValue: 'SOMETHING'
          }),
          ANOTHER_THING: experimentsExports.createExperimentGroup({
            value: 'bye',
            schemaValue: 'ANOTHER_THING'
          })
        }
      }),
      experimentsExports.createExperiment({
        name: 'fooTest',
        active: true,
        disabled: true,
        groups: {
          MY_CONTROL_GROUP: experimentsExports.createExperimentGroup({
            value: 'sameOld',
            schemaValue: 'THE_CONTROL'
          }),
          FUN_EXPERIMENT: experimentsExports.createExperimentGroup({
            value: 'newThing',
            schemaValue: 'EXPERIMENT'
          })
        }
      })
    ]
    expect(experimentsExports.getUserExperimentGroup('fooTest'))
      .toBe('none')
  })

  test('getUserExperimentGroup returns "none" when there are no experiments', () => {
    const experimentsExports = require('js/utils/experiments')
    experimentsExports.experiments = []
    expect(experimentsExports.getUserExperimentGroup('anOldTestWeRemoved'))
      .toBe('none')
  })

  test('getExperimentGroups returns the expected values', () => {
    const experimentsExports = require('js/utils/experiments')
    experimentsExports.experiments = [
      experimentsExports.createExperiment({
        name: 'exampleTest',
        active: true,
        disabled: false,
        groups: {
          SOMETHING: experimentsExports.createExperimentGroup({
            value: 'hi',
            schemaValue: 'SOMETHING'
          }),
          ANOTHER_THING: experimentsExports.createExperimentGroup({
            value: 'bye',
            schemaValue: 'ANOTHER_THING'
          })
        }
      }),
      experimentsExports.createExperiment({
        name: 'fooTest',
        active: true,
        disabled: true,
        groups: {
          MY_CONTROL_GROUP: experimentsExports.createExperimentGroup({
            value: 'sameOld',
            schemaValue: 'THE_CONTROL'
          }),
          FUN_EXPERIMENT: experimentsExports.createExperimentGroup({
            value: 'newThing',
            schemaValue: 'EXPERIMENT'
          })
        }
      })
    ]
    expect(experimentsExports.getExperimentGroups('fooTest'))
      .toEqual({
        MY_CONTROL_GROUP: 'sameOld',
        FUN_EXPERIMENT: 'newThing',
        NONE: 'none'
      })
    expect(experimentsExports.getExperimentGroups('exampleTest'))
      .toEqual({
        SOMETHING: 'hi',
        ANOTHER_THING: 'bye',
        NONE: 'none'
      })
  })

  test('getExperimentGroups returns only the "none" group when the experiment does not exist', () => {
    const experimentsExports = require('js/utils/experiments')
    experimentsExports.experiments = [
      experimentsExports.createExperiment({
        name: 'fooTest',
        active: true,
        disabled: true,
        groups: {
          MY_CONTROL_GROUP: experimentsExports.createExperimentGroup({
            value: 'sameOld',
            schemaValue: 'THE_CONTROL'
          }),
          FUN_EXPERIMENT: experimentsExports.createExperimentGroup({
            value: 'newThing',
            schemaValue: 'EXPERIMENT'
          })
        }
      })
    ]
    expect(experimentsExports.getExperimentGroups('thisExperimentDoesNotExist'))
      .toEqual({
        NONE: 'none'
      })
  })

  test('assignUserToTestGroups assigns the user to all active tests but not inactive tests', () => {
    const experimentsExports = require('js/utils/experiments')
    experimentsExports.experiments = [
      experimentsExports.createExperiment({
        name: 'exampleTest',
        active: true,
        disabled: false,
        groups: {
          SOMETHING: experimentsExports.createExperimentGroup({
            value: 'hi',
            schemaValue: 'SOMETHING'
          }),
          ANOTHER_THING: experimentsExports.createExperimentGroup({
            value: 'bye',
            schemaValue: 'ANOTHER_THING'
          })
        }
      }),
      experimentsExports.createExperiment({
        name: 'someTest',
        active: false,
        disabled: false,
        groups: {
          GROUP_A: experimentsExports.createExperimentGroup({
            value: 'groupA',
            schemaValue: 'THE_A_GROUP'
          }),
          GROUP_B: experimentsExports.createExperimentGroup({
            value: 'groupB',
            schemaValue: 'THE_B_GROUP'
          })
        }
      }),
      experimentsExports.createExperiment({
        name: 'fooTest',
        active: true,
        disabled: false,
        groups: {
          MY_CONTROL_GROUP: experimentsExports.createExperimentGroup({
            value: 'sameOld',
            schemaValue: 'THE_CONTROL'
          }),
          FUN_EXPERIMENT: experimentsExports.createExperimentGroup({
            value: 'newThing',
            schemaValue: 'EXPERIMENT'
          })
        }
      })
    ]
    jest.spyOn(Math, 'random').mockReturnValue(0)
    experimentsExports.assignUserToTestGroups()

    // Should store test group in localStorage.
    expect(localStorageMgr.setItem).toHaveBeenCalledTimes(2)
    expect(localStorageMgr.setItem)
      .toHaveBeenCalledWith('tab.experiments.exampleTest', 'hi')
    expect(localStorageMgr.setItem)
      .toHaveBeenCalledWith('tab.experiments.fooTest', 'sameOld')

    // Should return the assigned test groups.
    expect(experimentsExports.getUserExperimentGroup('exampleTest')).toBe('hi')
    expect(experimentsExports.getUserExperimentGroup('someTest')).toBe('none')
    expect(experimentsExports.getUserExperimentGroup('fooTest')).toBe('sameOld')
  })
})

/* Tests for actual experiments */
describe('Actual experiments we are running or will run', () => {
  test('assignUserToTestGroups saves the user\'s test groups to localStorage', () => {
    // // Control for randomness.
    // jest.spyOn(Math, 'random').mockReturnValue(0)

    const assignUserToTestGroups = require('js/utils/experiments').assignUserToTestGroups
    assignUserToTestGroups()

    // Placeholder while we do not have any active tests.
    expect(true).toBe(true)
  })
})

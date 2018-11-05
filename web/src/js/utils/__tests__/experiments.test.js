/* eslint-env jest */
import {
  forEach,
  sortBy
} from 'lodash/collection'
import { isPlainObject } from 'lodash/lang'

jest.mock('js/utils/localstorage-mgr')
jest.mock('js/utils/feature-flags')

let mathRandomMock

beforeEach(() => {
  // Control for randomness in tests.
  mathRandomMock = jest.spyOn(Math, 'random')
    .mockReturnValue(0)
})

afterEach(() => {
  // Clear mocked localstorage.
  const { __mockClear } = require('js/utils/localstorage-mgr')
  __mockClear()

  // Clear any return values set in tests.
  mathRandomMock.mockReset()

  jest.clearAllMocks()
  jest.resetModules()
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
      _localStorageKey: 'tab.experiments.fooTest',
      _saveTestGroupToLocalStorage: expect.any(Function),
      assignTestGroup: expect.any(Function),
      getTestGroup: expect.any(Function)
    })
  })

  test('createExperiment throws if a name is not provided', () => {
    const createExperiment = require('js/utils/experiments').createExperiment
    expect(() => {
      createExperiment({
        active: true
      })
    }).toThrow()
  })

  test('createExperimentGroup throws if missing a required key', () => {
    const { createExperimentGroup } = require('js/utils/experiments')
    expect(() => {
      createExperimentGroup({
        // Missing "value" key
        schemaValue: 'blah'
      })
    }).toThrow()
  })

  test('returns the "none" test group when the experiment is disabled', () => {
    const { createExperiment, createExperimentGroup } = require('js/utils/experiments')

    // Mock that the user is assigned to an experiment group.
    const localStorageMgr = require('js/utils/localstorage-mgr').default
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
    expect(experiment.getTestGroup().value).toEqual('none')
  })

  test('returns the experiment test group when the experiment is not disabled', () => {
    const { createExperiment, createExperimentGroup } = require('js/utils/experiments')

    // Mock that the user is assigned to an experiment group.
    const localStorageMgr = require('js/utils/localstorage-mgr').default
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
    expect(experiment.getTestGroup().value).toEqual('newThing')
  })

  test('returns the "none" test group when the experiment value in local storage is invalid', () => {
    const { createExperiment, createExperimentGroup } = require('js/utils/experiments')

    // Invalid local storage value
    const localStorageMgr = require('js/utils/localstorage-mgr').default
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
    expect(experiment.getTestGroup().value).toEqual('none')
  })

  test('does not assign the user to a test group when the experiment is inactive', () => {
    const localStorageMgr = require('js/utils/localstorage-mgr').default
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

    experiment.assignTestGroup()
    expect(localStorageMgr.setItem).not.toHaveBeenCalled()
  })

  test('does not assign the user to a test group if the user is in a "none" test group and we have not increased the scope of the experiment', () => {
    const { createExperiment, createExperimentGroup } = require('js/utils/experiments')

    // Mock that the user is assigned to an experiment group.
    const localStorageMgr = require('js/utils/localstorage-mgr').default
    localStorageMgr.setItem('tab.experiments.fooTest', 'none')
    localStorageMgr.setItem('tab.experiments.fooTest.percentageOfUsersLastAssigned', '15')
    localStorageMgr.setItem.mockClear()

    const experiment = createExperiment({
      name: 'fooTest',
      active: true,
      disabled: false,
      percentageOfUsersInExperiment: 15, // this has not changed
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

    experiment.assignTestGroup()
    expect(localStorageMgr.setItem).not.toHaveBeenCalled()
  })

  test('does not assign the user to a test group if the user is already assigned a non-"none" test group, even if we have increased the scope of the experiment', () => {
    const { createExperiment, createExperimentGroup } = require('js/utils/experiments')

    // Mock that the user is assigned to an experiment group.
    const localStorageMgr = require('js/utils/localstorage-mgr').default
    localStorageMgr.setItem('tab.experiments.fooTest', 'newThing')
    localStorageMgr.setItem('tab.experiments.fooTest.percentageOfUsersLastAssigned', '15')
    localStorageMgr.setItem.mockClear()

    const experiment = createExperiment({
      name: 'fooTest',
      active: true,
      disabled: false,
      percentageOfUsersInExperiment: 80, // this has increased
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

    experiment.assignTestGroup()
    expect(localStorageMgr.setItem).not.toHaveBeenCalled()
  })

  test('assigns the user to a test group if the user is in a "none" test group but we have increased the scope of the experiment', () => {
    const { createExperiment, createExperimentGroup } = require('js/utils/experiments')

    // Mock that the user is assigned to an experiment group.
    const localStorageMgr = require('js/utils/localstorage-mgr').default
    localStorageMgr.setItem('tab.experiments.fooTest', 'none')
    localStorageMgr.setItem('tab.experiments.fooTest.percentageOfUsersLastAssigned', '15')
    localStorageMgr.setItem.mockClear()

    const experiment = createExperiment({
      name: 'fooTest',
      active: true,
      disabled: false,
      percentageOfUsersInExperiment: 40, // this has increased
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

    experiment.assignTestGroup()
    expect(localStorageMgr.setItem)
      .toHaveBeenCalledWith('tab.experiments.fooTest', 'sameOld')
  })

  test('when we have increased the % of users in the experiment, we use the difference in likelihoods when reassigning users who were previously in the "none" test group (and fail to include the user)', () => {
    const { createExperiment, createExperimentGroup } = require('js/utils/experiments')

    // Mock that the user is assigned to an experiment group.
    const localStorageMgr = require('js/utils/localstorage-mgr').default
    localStorageMgr.setItem('tab.experiments.fooTest', 'none')
    localStorageMgr.setItem('tab.experiments.fooTest.percentageOfUsersLastAssigned', '15')
    localStorageMgr.setItem.mockClear()

    const experiment = createExperiment({
      name: 'fooTest',
      active: true,
      disabled: false,
      percentageOfUsersInExperiment: 40, // this has increased
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

    mathRandomMock
      // The user should be again excluded from the test because this value is
      // greater than 25 = 40 - 15.
      .mockReturnValueOnce(0.26) // for determining % inclusion
      .mockReturnValueOnce(0.99) // for determining experimental group

    experiment.assignTestGroup()
    expect(localStorageMgr.setItem)
      .toHaveBeenCalledWith('tab.experiments.fooTest', 'none')
  })

  test('when we have increased the % of users in the experiment, we use the difference in likelihoods when reassigning users who were previously in the "none" test group (and succeed in including the user)', () => {
    const { createExperiment, createExperimentGroup } = require('js/utils/experiments')

    // Mock that the user is assigned to an experiment group.
    const localStorageMgr = require('js/utils/localstorage-mgr').default
    localStorageMgr.setItem('tab.experiments.fooTest', 'none')
    localStorageMgr.setItem('tab.experiments.fooTest.percentageOfUsersLastAssigned', '15')
    localStorageMgr.setItem.mockClear()

    const experiment = createExperiment({
      name: 'fooTest',
      active: true,
      disabled: false,
      percentageOfUsersInExperiment: 40, // this has increased
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

    mathRandomMock
      // The user should now be included in the test because this value is
      // less than 25 = 40 - 15.
      .mockReturnValueOnce(0.24) // for determining % inclusion
      .mockReturnValueOnce(0.99) // for determining experimental group

    experiment.assignTestGroup()
    expect(localStorageMgr.setItem)
      .toHaveBeenCalledWith('tab.experiments.fooTest', 'newThing')
  })

  test('when reassigning users who were previously in the "none" test group, we save the latest "percentageOfUsersInExperiment" to local storage', () => {
    const { createExperiment, createExperimentGroup } = require('js/utils/experiments')

    // Mock that the user is assigned to an experiment group.
    const localStorageMgr = require('js/utils/localstorage-mgr').default
    localStorageMgr.setItem('tab.experiments.fooTest', 'none')
    localStorageMgr.setItem('tab.experiments.fooTest.percentageOfUsersLastAssigned', '15')
    localStorageMgr.setItem.mockClear()

    const experiment = createExperiment({
      name: 'fooTest',
      active: true,
      disabled: false,
      percentageOfUsersInExperiment: 40, // this has increased
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

    mathRandomMock
      .mockReturnValueOnce(0.24) // for determining % inclusion
      .mockReturnValueOnce(0.99) // for determining experimental group

    experiment.assignTestGroup()
    expect(localStorageMgr.setItem)
      .toHaveBeenCalledWith('tab.experiments.fooTest.percentageOfUsersLastAssigned', 40)
  })

  test('saves a test group to local storage when assigning a test group', () => {
    const localStorageMgr = require('js/utils/localstorage-mgr').default
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

    experiment.assignTestGroup()
    expect(localStorageMgr.setItem)
      .toHaveBeenCalledWith('tab.experiments.fooTest', 'sameOld')
  })

  test('saves "percentageOfUsersInExperiment" to local storage when assigning a test group', () => {
    const localStorageMgr = require('js/utils/localstorage-mgr').default
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

    experiment.assignTestGroup()

    // "percentageOfUsersLastAssigned" defaults to 100.
    expect(localStorageMgr.setItem)
      .toHaveBeenCalledWith('tab.experiments.fooTest.percentageOfUsersLastAssigned', 100)
  })

  test('selects from all the test groups when assigning the user to a test group', () => {
    const localStorageMgr = require('js/utils/localstorage-mgr').default
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
    mathRandomMock.mockReturnValue(0.99)

    experiment.assignTestGroup()
    expect(localStorageMgr.setItem)
      .toHaveBeenCalledWith('tab.experiments.fooTest', 'crazyThing')
  })

  test('assigns the "none" test group when there are no other groups', () => {
    const localStorageMgr = require('js/utils/localstorage-mgr').default
    const { createExperiment } = require('js/utils/experiments')
    const experiment = createExperiment({
      name: 'fooTest',
      active: true,
      disabled: false,
      groups: {}
    })

    experiment.assignTestGroup()
    expect(localStorageMgr.setItem)
      .toHaveBeenCalledWith('tab.experiments.fooTest', 'none')
  })

  test('assigns the "none" test group when the user is not in the random percentage of users', () => {
    const localStorageMgr = require('js/utils/localstorage-mgr').default
    const { createExperiment, createExperimentGroup } = require('js/utils/experiments')
    const experiment = createExperiment({
      name: 'fooTest',
      active: true,
      disabled: false,
      percentageOfUsersInExperiment: 20,
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

    mathRandomMock
      .mockReturnValueOnce(0.21) // for determining % inclusion
      .mockReturnValueOnce(0.99) // for determining experimental group
    experiment.assignTestGroup()
    expect(localStorageMgr.setItem)
      .toHaveBeenCalledWith('tab.experiments.fooTest', 'none')
  })

  test('assigns an experiment group when the user is included in the random percentage of users', () => {
    const localStorageMgr = require('js/utils/localstorage-mgr').default
    const { createExperiment, createExperimentGroup } = require('js/utils/experiments')
    const experiment = createExperiment({
      name: 'fooTest',
      active: true,
      disabled: false,
      percentageOfUsersInExperiment: 20,
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

    mathRandomMock
      .mockReturnValueOnce(0.17) // for determining % inclusion
      .mockReturnValueOnce(0.99) // for determining experimental group
    experiment.assignTestGroup()
    expect(localStorageMgr.setItem)
      .toHaveBeenCalledWith('tab.experiments.fooTest', 'crazyThing')
  })
})

/* Test core functionality with fake experiments */
describe('Main experiments functionality', () => {
  test('getUserExperimentGroup returns the expected value', () => {
    const experimentsExports = require('js/utils/experiments')

    // Mock that the user is assigned to an experiment group.
    const localStorageMgr = require('js/utils/localstorage-mgr').default
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
    const localStorageMgr = require('js/utils/localstorage-mgr').default
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
    const localStorageMgr = require('js/utils/localstorage-mgr').default
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
    const localStorageMgr = require('js/utils/localstorage-mgr').default
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
    experimentsExports.assignUserToTestGroups()

    // Should store test group in localStorage.
    expect(localStorageMgr.setItem)
      .toHaveBeenCalledWith('tab.experiments.exampleTest', 'hi')
    expect(localStorageMgr.setItem)
      .toHaveBeenCalledWith('tab.experiments.fooTest', 'sameOld')

    // Should return the assigned test groups.
    expect(experimentsExports.getUserExperimentGroup('exampleTest')).toBe('hi')
    expect(experimentsExports.getUserExperimentGroup('someTest')).toBe('none')
    expect(experimentsExports.getUserExperimentGroup('fooTest')).toBe('sameOld')
  })

  test('getUserTestGroupsForMutation returns the expected values for all tests (even inactive tests)', () => {
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
    experimentsExports.assignUserToTestGroups()
    const userGroupsForMutation = experimentsExports.getUserTestGroupsForMutation()
    expect(userGroupsForMutation).toEqual({
      exampleTest: 'SOMETHING',
      someTest: 'NONE',
      fooTest: 'THE_CONTROL'
    })
  })
})

/* Tests for actual experiments */
describe('Actual experiments we are running or will run', () => {
  test('experiments match expected', () => {
    const experiments = require('js/utils/experiments').experiments
    expect(sortBy(experiments, o => o.name)).toMatchObject([
      // Experiments ordered alphabetically by name
      {
        name: 'adExplanation',
        active: true,
        disabled: false
      },
      {
        name: 'oneAdForNewUsers',
        active: true,
        disabled: false
      },
      {
        name: 'thirdAd',
        active: true,
        disabled: false
      }
    ])
  })

  test('the experiments have valid groups object structure', () => {
    const experiments = require('js/utils/experiments').experiments
    experiments.forEach(exp => {
      forEach(exp.groups, group => {
        expect(isPlainObject(group)).toBe(true)
        expect(Object.keys(group)).toEqual(['value', 'schemaValue'])
      })
    })
  })
})

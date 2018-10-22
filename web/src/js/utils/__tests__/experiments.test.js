/* eslint-env jest */

import {
  __mockClear
} from 'js/utils/localstorage-mgr'

jest.mock('js/utils/localstorage-mgr')
jest.mock('js/utils/feature-flags')
afterEach(() => {
  __mockClear()
  jest.clearAllMocks()
})

describe('experiments', () => {
  /* Tests for all experiments */

  test('assignUserToTestGroups saves the user\'s test groups to localStorage', () => {
    // // Control for randomness.
    // jest.spyOn(Math, 'random').mockReturnValue(0)

    const assignUserToTestGroups = require('js/utils/experiments').assignUserToTestGroups
    assignUserToTestGroups()

    // Placeholder while we do not have any active tests.
    expect(true).toBe(true)
  })
})

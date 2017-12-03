/* eslint-env jest */

import moment from 'moment'
import { cloneDeep } from 'lodash/lang'
import UserModel from '../../database/users/UserModel'
import createUser from '../../database/users/createUser'
import {
  DatabaseOperation,
  getMockUserInstance,
  mockDate,
  setMockDBResponse
} from '../../database/test-utils'
import {
  getPermissionsOverride,
  MIGRATION_OVERRIDE
} from '../../utils/permissions-overrides'
const migrationOverride = getPermissionsOverride(MIGRATION_OVERRIDE)

jest.mock('../../database/databaseClient')
jest.mock('../../database/users/createUser')

beforeAll(() => {
  mockDate.on()
})

afterAll(() => {
  mockDate.off()
})

afterEach(() => {
  jest.clearAllMocks()
})

const exampleUser = {
  id: 'abc123',
  email: 'abc123@example.com',
  username: 'steve',
  joined: '2017-10-02T20:39:15.088Z',
  vcCurrent: 12,
  vcAllTime: 48,
  level: 4,
  tabs: 48,
  validTabs: 48,
  maxTabsDay: {
    maxDay: {
      date: '2017-11-18T20:39:15.088Z',
      numTabs: 11
    }
  },
  heartsUntilNextLevel: 12,
  vcDonatedAllTime: 36,
  numUsersRecruited: 1,
  lastTabTimestamp: '2017-12-02T20:39:15.088Z'
}

describe('createUserHandler migration', () => {
  it('calls createUser', async () => {
    const user = cloneDeep(exampleUser)
    const migrateUser = require('../createUserHandler').migrateUser
    await migrateUser(user)
    expect(createUser).toHaveBeenCalledWith(migrationOverride,
      'abc123', 'abc123@example.com')
  })

  it('updateUserFields calls the database as expected with a full user object', async () => {
    // The user passed into the function.
    const user = cloneDeep(exampleUser)

    // The expected user to be returned.
    const expectedUser = getMockUserInstance(user)
    setMockDBResponse(
      DatabaseOperation.UPDATE,
      {
        Attributes: expectedUser
      }
    )

    const updateMethod = jest.spyOn(UserModel, 'update')

    const migrateUser = require('../createUserHandler').migrateUser
    const updatedUser = await migrateUser(user)

    const updateParams = updateMethod.mock.calls[0]
    expect(updateParams[0]).toMatch(/MIGRATION_OVERRIDE_CONFIRMED_[0-9]{5}$/)
    expect(updateParams[1]).toEqual({
      ...user,
      updated: moment.utc().toISOString()
    })
    expect(updatedUser).toEqual(expectedUser)
  })
})

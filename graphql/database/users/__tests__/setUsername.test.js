/* eslint-env jest */

import moment from 'moment'
// import UserModel from '../UserModel'
import {
  getMockUserContext,
  mockDate
} from '../../test-utils'

jest.mock('../../databaseClient')
jest.mock('../getUserByUsername')
const userContext = getMockUserContext()

beforeAll(() => {
  mockDate.on()
})

afterAll(() => {
  mockDate.off()
})

beforeEach(() => {
  jest.clearAllMocks()
  jest.resetModules()
})

describe('setUsername', () => {
  it('works as expected when the username is not taken', async () => {
    // Mock that no user with this username exists.
    jest.mock('../getUserByUsername', () => jest.fn(() => null))

    const UserModel = require('../UserModel').default
    const updateQuery = jest.spyOn(UserModel, 'update')
    const username = 'bob'
    const setUsername = require('../setUsername').default
    await setUsername(userContext, userContext.id, username)
    expect(updateQuery).toHaveBeenCalledWith(userContext, {
      id: userContext.id,
      username: 'bob',
      updated: moment.utc().toISOString()
    })
  })

  it('returns an error when the username is already taken', async () => {
    // Mock that another user already has this username.
    jest.mock('../getUserByUsername', () => jest.fn(() => ({
      id: 'abc123',
      username: 'bob'
    })))

    const UserModel = require('../UserModel').default
    const updateQuery = jest.spyOn(UserModel, 'update')
    const username = 'bob'
    const setUsername = require('../setUsername').default
    const response = await setUsername(userContext, userContext.id, username)

    expect(response.user).toBeNull()
    expect(response.errors).toContainEqual({
      code: 'USERNAME_DUPLICATE',
      message: 'Username already exists'
    })

    // We should not set the username for this user
    expect(updateQuery).not.toHaveBeenCalled()
  })
})

/* eslint-env jest */

import moment from 'moment'
import { cloneDeep } from 'lodash/lang'
import {
  DatabaseOperation,
  getMockUserContext,
  getMockUserInstance,
  mockDate,
  setMockDBResponse
} from '../../test-utils'

jest.mock('../../databaseClient')
const userContext = getMockUserContext()

beforeAll(() => {
  mockDate.on()
})

afterAll(() => {
  mockDate.off()
})

beforeEach(() => {
  jest.clearAllMocks()
})

describe('logEmailVerified', () => {
  it('sets emailVerified=true when it is true', async () => {
    const UserModel = require('../UserModel').default
    const updateQuery = jest.spyOn(UserModel, 'update')

    const modifiedUserContext = cloneDeep(userContext)
    modifiedUserContext.emailVerified = true

    const logEmailVerified = require('../logEmailVerified').default
    await logEmailVerified(modifiedUserContext, modifiedUserContext.id)
    expect(updateQuery).toHaveBeenCalledWith(modifiedUserContext, {
      id: modifiedUserContext.id,
      emailVerified: true,
      updated: moment.utc().toISOString()
    })
  })

  it('sets emailVerified=false when it is false', async () => {
    const UserModel = require('../UserModel').default
    const updateQuery = jest.spyOn(UserModel, 'update')

    const modifiedUserContext = cloneDeep(userContext)
    modifiedUserContext.emailVerified = false

    const logEmailVerified = require('../logEmailVerified').default
    await logEmailVerified(modifiedUserContext, modifiedUserContext.id)
    expect(updateQuery).toHaveBeenCalledWith(modifiedUserContext, {
      id: modifiedUserContext.id,
      emailVerified: false,
      updated: moment.utc().toISOString()
    })
  })

  it('sets emailVerified=true with the default mock user context', async () => {
    const UserModel = require('../UserModel').default
    const updateQuery = jest.spyOn(UserModel, 'update')

    const logEmailVerified = require('../logEmailVerified').default
    await logEmailVerified(userContext, userContext.id)
    expect(updateQuery).toHaveBeenCalledWith(userContext, {
      id: userContext.id,
      emailVerified: true,
      updated: moment.utc().toISOString()
    })
  })

  it('returns the user object', async () => {
    // Mock DB response.
    const expectedReturnedUser = Object.assign(
      {},
      getMockUserInstance(),
      {
        emailVerified: true
      }
    )
    setMockDBResponse(
      DatabaseOperation.UPDATE,
      {
        Attributes: expectedReturnedUser
      }
    )

    const logEmailVerified = require('../logEmailVerified').default
    const returnedUser = await logEmailVerified(userContext, userContext.id)
    expect(returnedUser).toEqual(expectedReturnedUser)
  })
})

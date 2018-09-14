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
import rewardReferringUser from '../rewardReferringUser'

jest.mock('../../databaseClient')
jest.mock('../rewardReferringUser')

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
    expect.assertions(1)

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
    expect.assertions(1)

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
    expect.assertions(1)

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
    expect.assertions(1)

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

  it('calls to reward the referring user when the email is verified', async () => {
    expect.assertions(1)

    const modifiedUserContext = cloneDeep(userContext)
    modifiedUserContext.emailVerified = true

    const logEmailVerified = require('../logEmailVerified').default
    await logEmailVerified(modifiedUserContext, modifiedUserContext.id)
    expect(rewardReferringUser)
      .toHaveBeenCalledWith(modifiedUserContext, modifiedUserContext.id)
  })

  it('does not call to reward the referring user when the email is not verified', async () => {
    expect.assertions(1)

    const modifiedUserContext = cloneDeep(userContext)
    modifiedUserContext.emailVerified = false

    const logEmailVerified = require('../logEmailVerified').default
    await logEmailVerified(modifiedUserContext, modifiedUserContext.id)
    expect(rewardReferringUser).not.toHaveBeenCalled()
  })
})

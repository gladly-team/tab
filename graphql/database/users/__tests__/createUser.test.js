/* eslint-env jest */

import moment from 'moment'
import { clone } from 'lodash/lang'

import {
  DatabaseOperation,
  getMockUserObj,
  mockDate,
  setMockDBResponse
} from '../../test-utils'

jest.mock('../../referrals/referralData')
jest.mock('../rewardReferringUser')
jest.mock('../getUserByUsername')

jest.mock('../../databaseClient')

const userContext = getMockUserObj()
const userInfo = {
  id: userContext.id,
  username: userContext.username,
  email: userContext.email
}

beforeAll(() => {
  mockDate.on()
})

afterAll(() => {
  mockDate.off()
})

afterEach(() => {
  jest.resetModules()
})

describe('createUser', () => {
  it('works as expected without referralData', async () => {
    const UserModel = require('../UserModel').default
    const createUser = require('../createUser').default
    const logReferralData = require('../../referrals/referralData').logReferralData
    const rewardReferringUser = require('../rewardReferringUser').default

    const createMethod = jest.spyOn(UserModel, 'create')
    const referralData = null
    const userToCreate = clone(userInfo)

    await createUser(userContext, userToCreate.id,
      userToCreate.username, userToCreate.email, referralData)

    const expectedCreateItem = Object.assign({}, userToCreate, {
      created: moment.utc().toISOString(),
      updated: moment.utc().toISOString()
    })
    expect(createMethod)
      .toHaveBeenCalledWith(userContext, expectedCreateItem)
    expect(logReferralData).not.toHaveBeenCalled()
    expect(rewardReferringUser).not.toHaveBeenCalled()
  })

  it('logs referral data and rewards referring user', async () => {
    const UserModel = require('../UserModel').default
    const createUser = require('../createUser').default
    const logReferralData = require('../../referrals/referralData').logReferralData
    const rewardReferringUser = require('../rewardReferringUser').default

    const createMethod = jest.spyOn(UserModel, 'create')
    const userToCreate = clone(userInfo)
    const referralData = {
      referringUser: 'FriendOfMine'
    }

    // Mock fetching the referring user.
    const referringUserId = 'ppooiiuu-151a-4a9a-9289-06906670fd4e'
    jest.mock('../getUserByUsername', () => {
      return () => ({
        id: 'ppooiiuu-151a-4a9a-9289-06906670fd4e'
      })
    })

    await createUser(userContext, userToCreate.id,
      userToCreate.username, userToCreate.email, referralData)

    const expectedCreateItem = Object.assign({}, userToCreate, {
      created: moment.utc().toISOString(),
      updated: moment.utc().toISOString()
    })
    expect(createMethod)
      .toHaveBeenCalledWith(userContext, expectedCreateItem)
    expect(logReferralData)
      .toHaveBeenCalledWith(userToCreate.id, referringUserId)
    expect(rewardReferringUser)
      .toHaveBeenCalledWith(referringUserId)
  })

  it('works when referring user does not exist', async () => {
    const UserModel = require('../UserModel').default
    const createUser = require('../createUser').default
    const logReferralData = require('../../referrals/referralData').logReferralData
    const rewardReferringUser = require('../rewardReferringUser').default

    const createMethod = jest.spyOn(UserModel, 'create')
    const userToCreate = clone(userInfo)
    const referralData = {
      referringUser: 'FriendOfMine'
    }

    // Mock fetching the referring user.
    jest.mock('../getUserByUsername', () => {
      return () => null
    })

    await createUser(userContext, userToCreate.id,
      userToCreate.username, userToCreate.email, referralData)

    const expectedCreateItem = Object.assign({}, userToCreate, {
      created: moment.utc().toISOString(),
      updated: moment.utc().toISOString()
    })
    expect(createMethod)
      .toHaveBeenCalledWith(userContext, expectedCreateItem)
    expect(logReferralData).not.toHaveBeenCalled()
    expect(rewardReferringUser).not.toHaveBeenCalled()
  })

  it('calls the database as expected', async () => {
    const UserModel = require('../UserModel').default
    const createUser = require('../createUser').default

    const userToCreate = clone(userInfo)
    const referralData = null
    const dbQueryMock = setMockDBResponse(
      DatabaseOperation.CREATE,
      {
        Attributes: {}
      }
    )
    const expectedUser = Object.assign({}, new UserModel(userToCreate), {
      created: moment.utc().toISOString(),
      updated: moment.utc().toISOString()
    })
    const expectedParams = {
      Item: expectedUser,
      TableName: 'Users'
    }
    const createdItem = await createUser(userContext, userToCreate.id,
      userToCreate.username, userToCreate.email, referralData)
    const dbParams = dbQueryMock.mock.calls[0][0]
    expect(dbParams).toEqual(expectedParams)
    expect(createdItem).toEqual(expectedUser)
  })
})

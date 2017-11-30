/* eslint-env jest */

import moment from 'moment'
import { cloneDeep } from 'lodash/lang'

import UserModel from '../UserModel'
import createUser from '../createUser'
import logReferralData from '../../referrals/logReferralData'
import getUserByUsername from '../getUserByUsername'
import rewardReferringUser from '../rewardReferringUser'
import setUpWidgetsForNewUser from '../../widgets/setUpWidgetsForNewUser'
import {
  addTimestampFieldsToItem,
  DatabaseOperation,
  getMockUserContext,
  getMockUserInfo,
  getMockUserInstance,
  mockDate,
  setMockDBResponse
} from '../../test-utils'

jest.mock('../../databaseClient')

jest.mock('../../referrals/logReferralData')
jest.mock('../rewardReferringUser')
jest.mock('../getUserByUsername')
jest.mock('../../widgets/setUpWidgetsForNewUser')

const userContext = getMockUserContext()

beforeAll(() => {
  mockDate.on()
})

afterAll(() => {
  mockDate.off()
})

afterEach(() => {
  jest.clearAllMocks()
})

function getExpectedCreateItemFromUserInfo (userInfo) {
  return Object.assign(
    {},
    addTimestampFieldsToItem(userInfo),
    {
      joined: moment.utc().toISOString()
    }
  )
}

describe('createUser when user does not exist', () => {
  it('works as expected without referralData', async () => {
    const getOrCreateMethod = jest.spyOn(UserModel, 'getOrCreate')
    const userInfo = getMockUserInfo()
    const referralData = null
    await createUser(userContext, userInfo.id,
      userInfo.email, referralData)

    const expectedCreateItem = getExpectedCreateItemFromUserInfo(userInfo)
    expect(getOrCreateMethod)
      .toHaveBeenCalledWith(userContext, expectedCreateItem)
    expect(logReferralData).not.toHaveBeenCalled()
    expect(rewardReferringUser).not.toHaveBeenCalled()
  })

  it('works as expected with empty object referralData', async () => {
    const getOrCreateMethod = jest.spyOn(UserModel, 'getOrCreate')
    const userInfo = getMockUserInfo()
    const referralData = {}
    await createUser(userContext, userInfo.id,
      userInfo.email, referralData)

    const expectedCreateItem = getExpectedCreateItemFromUserInfo(userInfo)
    expect(getOrCreateMethod)
      .toHaveBeenCalledWith(userContext, expectedCreateItem)
    expect(logReferralData).not.toHaveBeenCalled()
    expect(rewardReferringUser).not.toHaveBeenCalled()
  })

  it('calls to set up initial widgets', async () => {
    const userInfo = getMockUserInfo()
    const referralData = null
    await createUser(userContext, userInfo.id,
      userInfo.email, referralData)
    expect(setUpWidgetsForNewUser)
      .toHaveBeenCalledWith(userContext, userInfo.id)
  })

  it('logs referral data and rewards referring user', async () => {
    const getOrCreateMethod = jest.spyOn(UserModel, 'getOrCreate')
    const userInfo = getMockUserInfo()
    const referralData = {
      referringUser: 'FriendOfMine'
    }

    // Mock fetching the referring user.
    const referringUserId = 'ppooiiuu-151a-4a9a-9289-06906670fd4e'
    getUserByUsername.mockImplementationOnce(() => {
      return {
        id: referringUserId
      }
    })

    await createUser(userContext, userInfo.id,
      userInfo.email, referralData)

    const expectedCreateItem = getExpectedCreateItemFromUserInfo(userInfo)
    expect(getOrCreateMethod)
      .toHaveBeenCalledWith(userContext, expectedCreateItem)
    expect(logReferralData)
      .toHaveBeenCalledWith(userContext, userInfo.id, referringUserId, null)
    expect(rewardReferringUser)
      .toHaveBeenCalledWith(referringUserId)
  })

  it('works when referring user does not exist', async () => {
    const getOrCreateMethod = jest.spyOn(UserModel, 'getOrCreate')
    const userInfo = getMockUserInfo()
    const referralData = {
      referringUser: 'FriendOfMine'
    }

    // Mock fetching the referring user.
    getUserByUsername.mockImplementationOnce(() => {
      return null
    })

    await createUser(userContext, userInfo.id,
      userInfo.email, referralData)

    const expectedCreateItem = getExpectedCreateItemFromUserInfo(userInfo)
    expect(getOrCreateMethod)
      .toHaveBeenCalledWith(userContext, expectedCreateItem)
    expect(logReferralData)
      .toHaveBeenCalledWith(userContext, userInfo.id, null, null)
    expect(rewardReferringUser).not.toHaveBeenCalled()
  })

  it('returns the user even if there is an error logging referral data', async () => {
    // Hide expected error output
    jest.spyOn(console, 'error')
      .mockImplementationOnce(() => {})

    const userInfo = getMockUserInfo()
    const referralData = {
      referringChannel: '42'
    }

    // Mock the response for getting the user.
    const expectedUser = getMockUserInstance(userInfo)
    setMockDBResponse(
      DatabaseOperation.GET,
      {
        Item: expectedUser
      }
    )

    // Some unexpected error in logging referral data.
    logReferralData.mockImplementationOnce(() => {
      throw new Error('Bad thing happened!')
    })

    await createUser(userContext, userInfo.id,
      userInfo.email, referralData)

    const createdItem = await createUser(userContext, userInfo.id,
      userInfo.email, referralData)
    expect(createdItem).toEqual(expectedUser)
  })

  it('logs "referringChannel" referral data', async () => {
    const userInfo = getMockUserInfo()
    const referralData = {
      referringChannel: '42'
    }

    // No referring user.
    getUserByUsername.mockImplementationOnce(() => {
      return null
    })

    await createUser(userContext, userInfo.id,
      userInfo.email, referralData)
    expect(logReferralData)
      .toHaveBeenCalledWith(userContext, userInfo.id, null, '42')
  })

  it('calls the database as expected', async () => {
    const userInfo = getMockUserInfo()
    const referralData = null
    const dbQueryMock = setMockDBResponse(
      DatabaseOperation.CREATE,
      {
        Attributes: {}
      }
    )
    const expectedUser = getMockUserInstance(userInfo)
    const expectedParamsUser = cloneDeep(expectedUser)
    delete expectedParamsUser.backgroundImage.imageURL
    const expectedParams = {
      ConditionExpression: '(#id <> :id)',
      ExpressionAttributeNames: {'#id': 'id'},
      ExpressionAttributeValues: {
        ':id': userInfo.id
      },
      Item: expectedParamsUser,
      TableName: UserModel.tableName
    }
    const createdItem = await createUser(userContext, userInfo.id,
      userInfo.email, referralData)
    const dbParams = dbQueryMock.mock.calls[0][0]
    expect(dbParams).toEqual(expectedParams)
    expect(createdItem).toEqual(expectedUser)
  })
})

describe('createUser when user already exists (should be idempotent)', () => {
  it('does not call to set up initial widgets', async () => {
    // Mock that the user already exists.
    setMockDBResponse(
      DatabaseOperation.CREATE,
      null,
      { code: 'ConditionalCheckFailedException' } // simple mock error
    )
    const userInfo = getMockUserInfo()
    const referralData = null
    await createUser(userContext, userInfo.id,
      userInfo.email, referralData)
    expect(setUpWidgetsForNewUser)
       .not.toHaveBeenCalled()
  })

  it('does not log referral data or reward referring user', async () => {
    // Mock that the user already exists.
    setMockDBResponse(
      DatabaseOperation.CREATE,
      null,
      { code: 'ConditionalCheckFailedException' } // simple mock error
    )
    const userInfo = getMockUserInfo()
    const referralData = {
      referringUser: 'FriendOfMine'
    }

    // Mock fetching the referring user.
    const referringUserId = 'ppooiiuu-151a-4a9a-9289-06906670fd4e'
    getUserByUsername.mockImplementationOnce(() => {
      return {
        id: referringUserId
      }
    })

    await createUser(userContext, userInfo.id,
      userInfo.email, referralData)

    expect(logReferralData)
      .not.toHaveBeenCalled()
    expect(rewardReferringUser)
      .not.toHaveBeenCalled()
  })

  it('returns the existing user', async () => {
    const userInfo = getMockUserInfo()
    const referralData = null

    // Mock that the user already exists.
    setMockDBResponse(
      DatabaseOperation.CREATE,
      null,
      { code: 'ConditionalCheckFailedException' } // simple mock error
    )

    // Mock the response for getting the user.
    const expectedUser = getMockUserInstance(userInfo)
    setMockDBResponse(
      DatabaseOperation.GET,
      {
        Item: expectedUser
      }
    )
    const createdItem = await createUser(userContext, userInfo.id,
      userInfo.email, referralData)
    expect(createdItem).toEqual(expectedUser)
  })
})

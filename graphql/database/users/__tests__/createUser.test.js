/* eslint-env jest */

import { clone } from 'lodash/lang'

import UserModel from '../UserModel'
import createUser from '../createUser'
import { logReferralData } from '../../referrals/referralData'
import getUserByUsername from '../getUserByUsername'
import rewardReferringUser from '../rewardReferringUser'
import {
  addTimestampFieldsToItem,
  DatabaseOperation,
  getMockUserContext,
  mockDate,
  setMockDBResponse
} from '../../test-utils'

jest.mock('../../databaseClient')

jest.mock('../../referrals/referralData')
jest.mock('../rewardReferringUser')
jest.mock('../getUserByUsername')

const userContext = getMockUserContext()
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
  jest.clearAllMocks()
})

describe('createUser', () => {
  it('works as expected without referralData', async () => {
    const createMethod = jest.spyOn(UserModel, 'create')
    const referralData = null
    const userToCreate = clone(userInfo)

    await createUser(userContext, userToCreate.id,
      userToCreate.username, userToCreate.email, referralData)

    const expectedCreateItem = addTimestampFieldsToItem(userToCreate)
    expect(createMethod)
      .toHaveBeenCalledWith(userContext, expectedCreateItem)
    expect(logReferralData).not.toHaveBeenCalled()
    expect(rewardReferringUser).not.toHaveBeenCalled()
  })

  it('logs referral data and rewards referring user', async () => {
    const createMethod = jest.spyOn(UserModel, 'create')
    const userToCreate = clone(userInfo)
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

    await createUser(userContext, userToCreate.id,
      userToCreate.username, userToCreate.email, referralData)

    const expectedCreateItem = addTimestampFieldsToItem(userToCreate)
    expect(createMethod)
      .toHaveBeenCalledWith(userContext, expectedCreateItem)
    expect(logReferralData)
      .toHaveBeenCalledWith(userToCreate.id, referringUserId)
    expect(rewardReferringUser)
      .toHaveBeenCalledWith(referringUserId)
  })

  it('works when referring user does not exist', async () => {
    const createMethod = jest.spyOn(UserModel, 'create')
    const userToCreate = clone(userInfo)
    const referralData = {
      referringUser: 'FriendOfMine'
    }

    // Mock fetching the referring user.
    getUserByUsername.mockImplementationOnce(() => {
      return null
    })

    await createUser(userContext, userToCreate.id,
      userToCreate.username, userToCreate.email, referralData)

    const expectedCreateItem = addTimestampFieldsToItem(userToCreate)
    expect(createMethod)
      .toHaveBeenCalledWith(userContext, expectedCreateItem)
    expect(logReferralData).not.toHaveBeenCalled()
    expect(rewardReferringUser).not.toHaveBeenCalled()
  })

  it('calls the database as expected', async () => {
    const userToCreate = clone(userInfo)
    const referralData = null
    const dbQueryMock = setMockDBResponse(
      DatabaseOperation.CREATE,
      {
        Attributes: {}
      }
    )
    const expectedUser = addTimestampFieldsToItem(new UserModel(userToCreate))
    const expectedParams = {
      Item: expectedUser,
      TableName: UserModel.tableName
    }
    const createdItem = await createUser(userContext, userToCreate.id,
      userToCreate.username, userToCreate.email, referralData)
    const dbParams = dbQueryMock.mock.calls[0][0]
    expect(dbParams).toEqual(expectedParams)
    expect(createdItem).toEqual(expectedUser)
  })
})

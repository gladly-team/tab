/* eslint-env jest */

import moment from 'moment'
import { cloneDeep } from 'lodash/lang'

import UserModel from '../UserModel'
import createUser from '../createUser'
import logReferralData from '../../referrals/logReferralData'
import getUserByUsername from '../getUserByUsername'
import setUpWidgetsForNewUser from '../../widgets/setUpWidgetsForNewUser'
import logUserExperimentGroups from '../logUserExperimentGroups'
import {
  addTimestampFieldsToItem,
  DatabaseOperation,
  getMockUserContext,
  getMockUserInfo,
  getMockUserInstance,
  mockDate,
  setMockDBResponse,
  clearAllMockDBResponses,
} from '../../test-utils'

jest.mock('../../databaseClient')

jest.mock('../../referrals/logReferralData')
jest.mock('../logEmailVerified')
jest.mock('../getUserByUsername')
jest.mock('../../widgets/setUpWidgetsForNewUser')
jest.mock('../logUserExperimentGroups')

const defaultUserContext = getMockUserContext()

beforeAll(() => {
  mockDate.on()
})

afterAll(() => {
  mockDate.off()
})

afterEach(() => {
  jest.clearAllMocks()
  clearAllMockDBResponses()
})

function getExpectedCreateItemFromUserInfo(userInfo) {
  return Object.assign({}, addTimestampFieldsToItem(userInfo), {
    joined: moment.utc().toISOString(),
  })
}

describe('createUser when user does not exist', () => {
  it('works as expected with email address but without other optional arguments', async () => {
    expect.assertions(2)

    // Mock database responses.
    const userInfo = getMockUserInfo()
    const userReturnedFromCreate = getMockUserInstance(
      Object.assign({}, userInfo)
    )
    setMockDBResponse(DatabaseOperation.CREATE, {
      Attributes: userReturnedFromCreate,
    })

    const getOrCreateMethod = jest.spyOn(UserModel, 'getOrCreate')
    const referralData = null
    const userContext = cloneDeep(defaultUserContext)
    userContext.emailVerified = false
    logUserExperimentGroups.mockResolvedValueOnce(userReturnedFromCreate)

    await createUser(userContext, userInfo.id, userInfo.email, referralData)

    const expectedCreateItem = getExpectedCreateItemFromUserInfo(userInfo)
    expect(getOrCreateMethod).toHaveBeenCalledWith(
      userContext,
      expectedCreateItem
    )
    expect(logReferralData).not.toHaveBeenCalled()
  })

  it('works as expected with empty object referralData', async () => {
    expect.assertions(2)

    // Mock database responses.
    const userInfo = getMockUserInfo()
    const userReturnedFromCreate = getMockUserInstance(
      Object.assign({}, userInfo)
    )
    setMockDBResponse(DatabaseOperation.CREATE, {
      Attributes: userReturnedFromCreate,
    })

    const getOrCreateMethod = jest.spyOn(UserModel, 'getOrCreate')
    const referralData = {}
    const userContext = cloneDeep(defaultUserContext)
    userContext.emailVerified = false
    logUserExperimentGroups.mockResolvedValueOnce(userReturnedFromCreate)

    await createUser(userContext, userInfo.id, userInfo.email, referralData)

    const expectedCreateItem = getExpectedCreateItemFromUserInfo(userInfo)
    expect(getOrCreateMethod).toHaveBeenCalledWith(
      userContext,
      expectedCreateItem
    )
    expect(logReferralData).not.toHaveBeenCalled()
  })

  it('works as expected without an email address', async () => {
    expect.assertions(1)

    // Mock database responses.
    const userInfo = getMockUserInfo()
    const userReturnedFromCreate = getMockUserInstance(
      Object.assign({}, userInfo)
    )
    setMockDBResponse(DatabaseOperation.CREATE, {
      Attributes: userReturnedFromCreate,
    })
    logUserExperimentGroups.mockResolvedValueOnce(userReturnedFromCreate)

    const getOrCreateMethod = jest.spyOn(UserModel, 'getOrCreate')

    // Remove the email info from the user context.
    const userContext = cloneDeep(defaultUserContext)
    delete userContext.email
    delete userContext.emailVerified

    await createUser(userContext, userInfo.id, null, null)

    // The expected item to create will have no email.
    const expectedCreateItem = getExpectedCreateItemFromUserInfo({
      id: userInfo.id,
      email: null,
    })
    expect(getOrCreateMethod).toHaveBeenCalledWith(
      userContext,
      expectedCreateItem
    )
  })

  it('uses the email address from the context (user claims), not the provided value', async () => {
    expect.assertions(1)

    // Mock database responses.
    const userInfo = getMockUserInfo()
    const userReturnedFromCreate = getMockUserInstance(
      Object.assign({}, userInfo)
    )
    setMockDBResponse(DatabaseOperation.CREATE, {
      Attributes: userReturnedFromCreate,
    })

    const getOrCreateMethod = jest.spyOn(UserModel, 'getOrCreate')

    // Remove the email info from the user context.
    const userContext = cloneDeep(defaultUserContext)
    userContext.emailVerified = false
    logUserExperimentGroups.mockResolvedValueOnce(userReturnedFromCreate)
    userContext.email = 'someotheremail@example.com'

    await createUser(userContext, userInfo.id, 'notthesame@example.com', null)

    const expectedCreateItem = getExpectedCreateItemFromUserInfo({
      id: userInfo.id,
      email: 'someotheremail@example.com',
    })
    expect(getOrCreateMethod).toHaveBeenCalledWith(
      userContext,
      expectedCreateItem
    )
  })

  it('works as expected with extensionInstallId and extensionInstallTimeApprox', async () => {
    expect.assertions(1)

    // Mock database responses.
    const userInfo = getMockUserInfo()
    const userReturnedFromCreate = getMockUserInstance(
      Object.assign({}, userInfo)
    )
    setMockDBResponse(DatabaseOperation.CREATE, {
      Attributes: userReturnedFromCreate,
    })

    const getOrCreateMethod = jest.spyOn(UserModel, 'getOrCreate')
    const referralData = null
    const experimentGroups = null
    const userContext = cloneDeep(defaultUserContext)
    userContext.emailVerified = false
    logUserExperimentGroups.mockResolvedValueOnce(userReturnedFromCreate)

    const extensionInstallId = '9359e548-1bd8-4bf1-9e10-09b5b6b4df34'
    const extensionInstallTimeApprox = '2018-08-18T01:12:59.187Z'

    await createUser(
      userContext,
      userInfo.id,
      userInfo.email,
      referralData,
      experimentGroups,
      extensionInstallId,
      extensionInstallTimeApprox
    )

    const expectedCreateItem = Object.assign(
      getExpectedCreateItemFromUserInfo(userInfo),
      {
        extensionInstallId: extensionInstallId,
        extensionInstallTimeApprox: extensionInstallTimeApprox,
      }
    )
    expect(getOrCreateMethod).toHaveBeenCalledWith(
      userContext,
      expectedCreateItem
    )
  })

  it('calls to set up initial widgets', async () => {
    expect.assertions(1)

    // Mock database responses.
    const userInfo = getMockUserInfo()
    const userReturnedFromCreate = getMockUserInstance(
      Object.assign({}, userInfo)
    )
    setMockDBResponse(DatabaseOperation.CREATE, {
      Attributes: userReturnedFromCreate,
    })

    const referralData = null
    const userContext = cloneDeep(defaultUserContext)
    userContext.emailVerified = false
    logUserExperimentGroups.mockResolvedValueOnce(userReturnedFromCreate)

    await createUser(userContext, userInfo.id, userInfo.email, referralData)
    expect(setUpWidgetsForNewUser).toHaveBeenCalledWith(
      userContext,
      userInfo.id
    )
  })

  it('logs referral data', async () => {
    expect.assertions(2)

    // Mock database responses.
    const userInfo = getMockUserInfo()
    const userReturnedFromCreate = getMockUserInstance(
      Object.assign({}, userInfo)
    )
    setMockDBResponse(DatabaseOperation.CREATE, {
      Attributes: userReturnedFromCreate,
    })

    const getOrCreateMethod = jest.spyOn(UserModel, 'getOrCreate')
    const referralData = {
      referringUser: 'FriendOfMine',
    }

    // Mock fetching the referring user.
    const referringUserId = 'ppooiiuu-151a-4a9a-9289-06906670fd4e'
    getUserByUsername.mockResolvedValueOnce({
      id: referringUserId,
    })

    const userContext = cloneDeep(defaultUserContext)
    userContext.emailVerified = false
    logUserExperimentGroups.mockResolvedValueOnce(userReturnedFromCreate)

    await createUser(userContext, userInfo.id, userInfo.email, referralData)

    const expectedCreateItem = getExpectedCreateItemFromUserInfo(userInfo)
    expect(getOrCreateMethod).toHaveBeenCalledWith(
      userContext,
      expectedCreateItem
    )
    expect(logReferralData).toHaveBeenCalledWith(
      userContext,
      userInfo.id,
      referringUserId,
      null
    )
  })

  it('works when referring user does not exist', async () => {
    expect.assertions(2)

    // Mock database responses.
    const userInfo = getMockUserInfo()
    const userReturnedFromCreate = getMockUserInstance(
      Object.assign({}, userInfo)
    )
    setMockDBResponse(DatabaseOperation.CREATE, {
      Attributes: userReturnedFromCreate,
    })

    const getOrCreateMethod = jest.spyOn(UserModel, 'getOrCreate')
    const referralData = {
      referringUser: 'FriendOfMine',
    }

    // Mock fetching the referring user.
    getUserByUsername.mockResolvedValueOnce(null)

    const userContext = cloneDeep(defaultUserContext)
    userContext.emailVerified = false
    logUserExperimentGroups.mockResolvedValueOnce(userReturnedFromCreate)

    await createUser(userContext, userInfo.id, userInfo.email, referralData)

    const expectedCreateItem = getExpectedCreateItemFromUserInfo(userInfo)
    expect(getOrCreateMethod).toHaveBeenCalledWith(
      userContext,
      expectedCreateItem
    )
    expect(logReferralData).toHaveBeenCalledWith(
      userContext,
      userInfo.id,
      null,
      null
    )
  })

  it('returns the user even if there is an error logging referral data', async () => {
    expect.assertions(1)

    // Mock database responses.
    const userInfo = getMockUserInfo()
    const userReturnedFromCreate = getMockUserInstance(
      Object.assign({}, userInfo)
    )
    setMockDBResponse(DatabaseOperation.CREATE, {
      Attributes: userReturnedFromCreate,
    })

    // Hide expected error output
    jest.spyOn(console, 'error').mockImplementationOnce(() => {})

    const referralData = {
      referringChannel: '42',
    }

    // Mock fetching the referring user.
    const referringUserId = 'ppooiiuu-151a-4a9a-9289-06906670fd4e'
    getUserByUsername.mockResolvedValueOnce({
      id: referringUserId,
    })

    // Some unexpected error in logging referral data.
    logReferralData.mockImplementationOnce(() => {
      throw new Error('Bad thing happened!')
    })

    const userContext = cloneDeep(defaultUserContext)
    userContext.emailVerified = false
    logUserExperimentGroups.mockResolvedValueOnce(userReturnedFromCreate)

    const createdItem = await createUser(
      userContext,
      userInfo.id,
      userInfo.email,
      referralData
    )

    // The user was just created, so we expect the 'justCreated' field to be true.
    userReturnedFromCreate.justCreated = true
    expect(createdItem).toEqual(userReturnedFromCreate)
  })

  it('logs "referringChannel" referral data', async () => {
    expect.assertions(1)

    // Mock database responses.
    const userInfo = getMockUserInfo()
    const userReturnedFromCreate = getMockUserInstance(
      Object.assign({}, userInfo)
    )
    setMockDBResponse(DatabaseOperation.CREATE, {
      Attributes: userReturnedFromCreate,
    })

    const referralData = {
      referringChannel: '42',
    }

    // No referring user.
    getUserByUsername.mockResolvedValueOnce(null)

    const userContext = cloneDeep(defaultUserContext)
    userContext.emailVerified = false
    logUserExperimentGroups.mockResolvedValueOnce(userReturnedFromCreate)

    await createUser(userContext, userInfo.id, userInfo.email, referralData)
    expect(logReferralData).toHaveBeenCalledWith(
      userContext,
      userInfo.id,
      null,
      '42'
    )
  })

  it("logs the user's experiment groups", async () => {
    expect.assertions(1)

    // Mock database responses.
    const userInfo = getMockUserInfo()
    const userReturnedFromCreate = getMockUserInstance(
      Object.assign({}, userInfo)
    )
    setMockDBResponse(DatabaseOperation.CREATE, {
      Attributes: userReturnedFromCreate,
    })
    const referralData = null

    const userContext = cloneDeep(defaultUserContext)
    userContext.emailVerified = false
    logUserExperimentGroups.mockResolvedValueOnce(userReturnedFromCreate)

    const fakeExperimentGroups = {
      someExperiment: 2,
      anotherThing: 0,
    }

    await createUser(
      userContext,
      userInfo.id,
      userInfo.email,
      referralData,
      fakeExperimentGroups
    )
    expect(logUserExperimentGroups).toHaveBeenCalledWith(
      userContext,
      userInfo.id,
      fakeExperimentGroups
    )
  })

  it("calls to log the user's experiment groups with an empty object if none is provided", async () => {
    expect.assertions(1)

    // Mock database responses.
    const userInfo = getMockUserInfo()
    const userReturnedFromCreate = getMockUserInstance(
      Object.assign({}, userInfo)
    )
    setMockDBResponse(DatabaseOperation.CREATE, {
      Attributes: userReturnedFromCreate,
    })
    const referralData = null

    const userContext = cloneDeep(defaultUserContext)
    userContext.emailVerified = false
    logUserExperimentGroups.mockResolvedValueOnce(userReturnedFromCreate)

    // No experiment groups are provided.
    await createUser(userContext, userInfo.id, userInfo.email, referralData)
    expect(logUserExperimentGroups).toHaveBeenCalledWith(
      userContext,
      userInfo.id,
      {}
    )
  })

  it("throws if there is an error logging the user's experiment groups", async () => {
    expect.assertions(1)

    // Mock database responses.
    const userInfo = getMockUserInfo()
    const userReturnedFromCreate = getMockUserInstance(
      Object.assign({}, userInfo)
    )
    setMockDBResponse(DatabaseOperation.CREATE, {
      Attributes: userReturnedFromCreate,
    })
    const referralData = null

    const userContext = cloneDeep(defaultUserContext)
    userContext.emailVerified = false

    logUserExperimentGroups.mockImplementationOnce(() => {
      throw new Error('Experiment gone wrong!')
    })
    const fakeExperimentGroups = {
      someExperiment: 2,
      anotherThing: 0,
    }

    return expect(
      createUser(
        userContext,
        userInfo.id,
        userInfo.email,
        referralData,
        fakeExperimentGroups
      )
    ).rejects.toThrow()
  })

  it('calls the database as expected', async () => {
    expect.assertions(2)

    // Mock database responses.
    const userInfo = getMockUserInfo()
    const userReturnedFromCreate = getMockUserInstance(
      Object.assign({}, userInfo)
    )
    const dbQueryMock = setMockDBResponse(DatabaseOperation.CREATE, {
      Attributes: userReturnedFromCreate,
    })

    const referralData = null
    const expectedParamsUser = cloneDeep(userReturnedFromCreate)

    // Remove dynamic fields (won't be passed during creation)
    delete expectedParamsUser.backgroundImage.imageURL
    delete expectedParamsUser.backgroundImage.thumbnailURL
    delete expectedParamsUser.tabsToday

    const expectedParams = {
      ConditionExpression: '(#id <> :id)',
      ExpressionAttributeNames: { '#id': 'id' },
      ExpressionAttributeValues: {
        ':id': userInfo.id,
      },
      Item: expectedParamsUser,
      TableName: UserModel.tableName,
    }

    const userContext = cloneDeep(defaultUserContext)
    userContext.emailVerified = false
    logUserExperimentGroups.mockResolvedValueOnce(userReturnedFromCreate)

    const createdItem = await createUser(
      userContext,
      userInfo.id,
      userInfo.email,
      referralData
    )
    const dbParams = dbQueryMock.mock.calls[0][0]
    expect(dbParams).toEqual(expectedParams)

    // The user was just created, so we expect the 'justCreated' field to be true.
    userReturnedFromCreate.justCreated = true

    expect(createdItem).toEqual(userReturnedFromCreate)
  })
})

describe('createUser when user already exists (should be idempotent)', () => {
  it('does not call to set up initial widgets', async () => {
    expect.assertions(1)

    // Mock that the user already exists.
    setMockDBResponse(
      DatabaseOperation.CREATE,
      null,
      { code: 'ConditionalCheckFailedException' } // simple mock error
    )

    // Mock database responses.
    const userInfo = getMockUserInfo()
    const existingUser = getMockUserInstance(
      Object.assign({}, userInfo, { emailVerified: true })
    )
    setMockDBResponse(DatabaseOperation.GET, {
      Item: existingUser,
    })

    const referralData = null
    const userContext = cloneDeep(defaultUserContext)

    await createUser(userContext, userInfo.id, userInfo.email, referralData)
    expect(setUpWidgetsForNewUser).not.toHaveBeenCalled()
  })

  it('does not log referral data', async () => {
    expect.assertions(1)

    // Mock that the user already exists.
    setMockDBResponse(
      DatabaseOperation.CREATE,
      null,
      { code: 'ConditionalCheckFailedException' } // simple mock error
    )
    const userInfo = getMockUserInfo()
    const referralData = {
      referringUser: 'FriendOfMine',
    }

    // Mock database responses.
    const existingUser = getMockUserInstance(
      Object.assign({}, userInfo, { emailVerified: true })
    )
    setMockDBResponse(DatabaseOperation.GET, {
      Item: existingUser,
    })

    // Mock fetching the referring user.
    const referringUserId = 'ppooiiuu-151a-4a9a-9289-06906670fd4e'
    getUserByUsername.mockResolvedValueOnce({
      id: referringUserId,
    })

    const userContext = cloneDeep(defaultUserContext)
    await createUser(userContext, userInfo.id, userInfo.email, referralData)

    expect(logReferralData).not.toHaveBeenCalled()
  })

  it("does not log the user's experiment groups", async () => {
    expect.assertions(1)

    // Mock that the user already exists.
    setMockDBResponse(
      DatabaseOperation.CREATE,
      null,
      { code: 'ConditionalCheckFailedException' } // simple mock error
    )

    // Mock database responses.
    const userInfo = getMockUserInfo()
    const existingUser = getMockUserInstance(
      Object.assign({}, userInfo, { emailVerified: true })
    )
    setMockDBResponse(DatabaseOperation.GET, {
      Item: existingUser,
    })

    const referralData = null
    const userContext = cloneDeep(defaultUserContext)
    const fakeExperimentGroups = {
      someExperiment: 2,
      anotherThing: 0,
    }

    await createUser(
      userContext,
      userInfo.id,
      userInfo.email,
      referralData,
      fakeExperimentGroups
    )
    expect(logUserExperimentGroups).not.toHaveBeenCalled()
  })

  it('returns the existing user', async () => {
    expect.assertions(1)

    const userInfo = getMockUserInfo()
    const referralData = null

    // Mock that the user already exists.
    setMockDBResponse(
      DatabaseOperation.CREATE,
      null,
      { code: 'ConditionalCheckFailedException' } // simple mock error
    )

    // Mock database responses.
    const existingUser = getMockUserInstance(
      Object.assign({}, userInfo, { emailVerified: true })
    )
    setMockDBResponse(DatabaseOperation.GET, {
      Item: existingUser,
    })

    const userContext = cloneDeep(defaultUserContext)
    const createdItem = await createUser(
      userContext,
      userInfo.id,
      userInfo.email,
      referralData
    )
    expect(createdItem).toEqual(existingUser)
  })

  it("updates the existing user's email address if it is different from the user claims", async () => {
    expect.assertions(2)

    const userInfo = getMockUserInfo()
    const referralData = null

    // Mock that the user already exists.
    setMockDBResponse(
      DatabaseOperation.CREATE,
      null,
      { code: 'ConditionalCheckFailedException' } // simple mock error
    )

    // Mock database responses.
    const existingUser = getMockUserInstance(
      Object.assign({}, userInfo, { emailVerified: true })
    )
    setMockDBResponse(DatabaseOperation.GET, {
      Item: existingUser,
    })

    // Set the email in the user context.
    const userContext = cloneDeep(defaultUserContext)
    userContext.email = 'myemail@example.com'

    // Mock the response for updating the email address.
    setMockDBResponse(DatabaseOperation.UPDATE, {
      // Like original user but with modified email.
      Attributes: Object.assign({}, existingUser, { email: userContext.email }),
    })

    const updateMethod = jest.spyOn(UserModel, 'update')

    const returnedUser = await createUser(
      userContext,
      userInfo.id,
      userInfo.email,
      referralData
    )

    expect(updateMethod).toHaveBeenCalledWith(userContext, {
      id: userInfo.id,
      email: 'myemail@example.com',
      updated: moment.utc().toISOString(),
    })
    expect(returnedUser.email).toEqual('myemail@example.com')
  })

  it("updates the existing user's emailVerified property if it is different from the value in user claims", async () => {
    expect.assertions(2)

    const userInfo = getMockUserInfo()
    const referralData = null

    // Mock that the user already exists.
    setMockDBResponse(
      DatabaseOperation.CREATE,
      null,
      { code: 'ConditionalCheckFailedException' } // simple mock error
    )

    // Mock database responses.
    const existingUser = getMockUserInstance(
      Object.assign({}, userInfo, { emailVerified: false })
    )
    setMockDBResponse(DatabaseOperation.GET, {
      Item: existingUser,
    })

    const userContext = cloneDeep(defaultUserContext)
    userContext.emailVerified = true // Different from the existing user's value

    // Mock the response from updating the emailVerified value.
    const updatedUser = Object.assign({}, existingUser, { emailVerified: true })
    const logEmailVerified = require('../logEmailVerified').default
    logEmailVerified.mockResolvedValue(updatedUser)

    const returnedUser = await createUser(
      userContext,
      userInfo.id,
      userInfo.email,
      referralData
    )

    expect(logEmailVerified).toHaveBeenCalledWith(userContext, userInfo.id)
    expect(returnedUser.emailVerified).toBe(true)
  })

  it("does not update the existing user's emailVerified property if it is the same as the value in user claims", async () => {
    expect.assertions(1)

    const userInfo = getMockUserInfo()
    const referralData = null

    // Mock that the user already exists.
    setMockDBResponse(
      DatabaseOperation.CREATE,
      null,
      { code: 'ConditionalCheckFailedException' } // simple mock error
    )

    // Mock database responses.
    const existingUser = getMockUserInstance(
      Object.assign({}, userInfo, { emailVerified: true })
    )
    setMockDBResponse(DatabaseOperation.GET, {
      Item: existingUser,
    })

    const userContext = cloneDeep(defaultUserContext)
    userContext.emailVerified = true // Same as the existing user's value

    // Mock the response from updating the emailVerified value.
    const logEmailVerified = require('../logEmailVerified').default
    logEmailVerified.mockResolvedValue(existingUser)

    await createUser(userContext, userInfo.id, userInfo.email, referralData)

    expect(logEmailVerified).not.toHaveBeenCalledWith(userContext, userInfo.id)
  })
})

/* eslint-env jest */

import moment from 'moment'
import databaseClient from './databaseClient'
import UserModel from './users/UserModel'
import CauseModel from './cause/CauseModel'
import { USER_VISIT_IMPACT_VALUE } from './constants'

export const DatabaseOperation = {
  BATCH_GET: 'batchGet',
  BATCH_WRITE: 'batchWrite',
  PUT: 'put',
  GET: 'get',
  DELETE: 'delete',
  UPDATE: 'update',
  SCAN: 'scan',
  QUERY: 'query',
  // Aliases
  CREATE: 'put',
  GET_ALL: 'scan',
  GET_BATCH: 'batchGet',
  GET_ITEMS: 'batchGet',
}

const availableOperations = [
  'batchGet',
  'batchWrite',
  'put',
  'get',
  'delete',
  'update',
  'scan',
  'query',
]

// Deprecated: use more explicit mocks (see BaseModel-queries.testjs for examples).
/**
 * Set a mock return function for a call to the database client.
 * @param {string} operation - The database operation to override
 * @param {*} returnVal - The value to return from the database client call.
 * @param {Object} error - An error value to return
 * @return {function} An instance of `jest.fn`, a mock function
 */
export const setMockDBResponse = (
  operation,
  returnVal = null,
  error = null
) => {
  jest.mock('./databaseClient')
  if (availableOperations.indexOf(operation) === -1) {
    const dbOps = Object.keys(DatabaseOperation).join(', ')
    throw new Error(`Mock database operation must be one of: ${dbOps}`)
  }
  return databaseClient[operation].mockImplementationOnce(
    (params, callback) => {
      callback(error, returnVal)
    }
  )
}

// Deprecated: use more explicit mocks (see BaseModel-queries.testjs for examples).
/**
 * Clear all mock implementations for database operations.
 * @return {undefined}
 */
export const clearAllMockDBResponses = () => {
  availableOperations.forEach(operation => {
    databaseClient[operation].mockReset()
  })
}

/**
 * Set the `permissions` getter value for a model class.
 * @param {Object} modelClass - The model class (extended from BaseModel)
 * @param {Object} permissions - The permissions object
 * @return {null}
 */
export const setModelPermissions = (modelClass, permissions) => {
  Object.defineProperty(modelClass, 'permissions', {
    get: () => permissions,
  })
}

/**
 * Set a getter value for a model class.
 * @param {Object} modelClass - The model class (extended from BaseModel)
 * @param {string} fieldName - The name of the field
 * @param {*} val - The value the getter should return
 * @return {null}
 */
export const setModelGetterField = (modelClass, fieldName, val) => {
  Object.defineProperty(modelClass, fieldName, {
    get: () => val,
    configurable: true,
  })
}

/**
 * Get a mock user object (as passed from GraphQL context).
 * @return {Object} The mock user.
 */
export const getMockUserContext = () => ({
  id: 'abcdefghijklmno',
  email: 'foo@bar.com',
  emailVerified: true,
  authTime: 1533144713,
})

/**
 * Get a mock user info.
 * @return {Object} The mock user info object.
 */
export const getMockUserInfo = () => ({
  id: 'abcdefghijklmno',
  email: 'foo@bar.com',
})

/**
 * Get a mock user impact
 * @return {Object} The mock user impact object
 */
export const getMockUserImpact = () => ({
  userId: 'abcdefghijklmno',
  charityId: '6ce5ad8e-7dd4-4de5-ba4f-13868e7d212z',
  updated: '2017-06-22T01:13:28.000Z',
  visitsUntilNextImpact: USER_VISIT_IMPACT_VALUE,
  pendingUserReferralImpact: 0,
  pendingUserReferralCount: 0,
  hasClaimedLatestReward: true,
  userImpactMetric: 0,
  confirmedImpact: true,
})
/**
 * Set the global `Date` to always return the same date.
 */
export const mockDate = {}
mockDate.defaultDateISO = '2017-05-19T13:59:46.000Z'

export const getMockCauseInstance = attributes => {
  return new CauseModel(
    Object.assign(
      {},
      {
        id: '123456789',
        charityId: 'abcdefghijklmnop',
        landingPagePath: '/test',
        impactVisits: 10,
        impact: {
          impactCounterText: 'impactCounterText',
          claimImpactSubtitle: 'claimImpactSubtitle',
          referralRewardNotification: 'referralRewardNotification',
          impactIcon: 'jellyfish',
          walkMeGif: 'dolphin.gif',
          referralRewardTitle: 'referralRewardTitle',
          referralRewardSubtitle: 'referralRewardSubtitle',
          newlyReferredImpactWalkthroughText:
            'newlyReferredImpactWalkthroughText',
          impactWalkthroughText: 'impactWalkthroughText',
          confirmImpactSubtitle: 'confirmImpactSubtitle',
        },
        theme: {
          primaryColor: '#5094FB',
          secondayColor: '#29BEBA',
        },
        squads: {
          squadCounterText: 'squadCounterText',
          currentMissionSummary: 'currentMissionSummary',
          currentMissionDetails: 'currentMissionDetails',
          currentMissionAlert: 'currentMissionAlert',
          currentMissionStep2: 'currentMissionStep2',
          currentMissionStep3: 'currentMissionStep3',
          missionCompleteAlert: 'missionCompleteAlert',
          missionCompleteDescription: 'missionCompleteDescription',
          missionCompleteSubtitle: 'missionCompleteSubtitle',
          impactCounterText: 'impactCounterText',
          squadInviteTemplateId: 'template-id',
        },
        onboarding: {
          steps: [],
          firstTabIntroDescription: 'firstTabIntroDescription',
        },
      },
      attributes
    )
  )
}
/**
 * Get a mock User instance.
 * @param {Object} attributes - Attributes to override when getting the mock user.
 * @return {Object} The mock user.
 */
export const getMockUserInstance = attributes => {
  const defaultUserInfo = getMockUserInfo()
  const now = mockDate.defaultDateISO
  return new UserModel(
    Object.assign({}, defaultUserInfo, attributes, {
      created: now,
      updated: now,
      joined: now,
      deleted: false,
    })
  )
}

/**
 * Set the global `Date` to always return the same date.
 * @param {string} dateStr - The date strting to use in the Date constructor.
 * @param {Object} options - Options for mockDate
 * @param {boolean} options.mockCurrentTimeOnly - If true, only return the
 *   mocked date for Date.now(), but not for other Date instances.
 */
mockDate.on = (dateStr = null, options = {}) => {
  if (!mockDate._origDate) {
    mockDate._origDate = Date
  }

  const constantDate = dateStr
    ? new Date(dateStr)
    : new Date(mockDate.defaultDateISO)
  const mockCurrentTimeOnly = !!options.mockCurrentTimeOnly

  global.Date = Date
  if (mockCurrentTimeOnly) {
    global.Date.now = () => constantDate
  } else {
    global.Date = () => constantDate
    global.Date.now = () => constantDate
    global.Date.UTC = () => constantDate
    global.Date.parse = () => constantDate
  }
}

/**
 * Reset the global `Date` to the native Date object.
 */
mockDate.off = () => {
  global.Date = mockDate._origDate || Date
}

/**
 * Clone an object, adding 'created' and 'updated' ISO timestamp fields.
 * @param {Object} item - A database item.
 * @return {Object} The item with 'created' and 'updated' fields.
 */
export const addTimestampFieldsToItem = item => {
  const now = moment.utc().toISOString()
  return Object.assign({}, item, {
    created: now,
    updated: now,
  })
}

/**
 * Mock a ConditionalCheckFailedException error from DynamoDB.
 * @return {Object} An Error object with
 *   code == 'ConditionalCheckFailedException'
 */
export const MockAWSConditionalCheckFailedError = () => {
  const err = new Error('Conditional check failed.')
  err.code = 'ConditionalCheckFailedException'
  return err
}

/**
 * Mock a response from node-fetch.
 * @return {Object}
 */
export const getMockFetchResponse = () => ({
  body: {},
  bodyUsed: true,
  headers: {},
  json: () => Promise.resolve({}),
  ok: true,
  redirected: false,
  status: 200,
  statusText: '',
  type: 'cors',
  url: 'https://example.com/foo/',
})

/**
 * Get mock AWS API Gateway event passed to AWS Lambda.
 * @return {Object}
 */
export const getMockAPIGatewayEvent = () => ({
  resource: '',
  path: '/some-path/',
  httpMethod: 'GET',
  headers: [],
  queryStringParameters: {
    example: 'param-value',
  },
  pathParameters: {},
  stageVariables: {},
  requestContext: {
    path: '/some-path/',
    accountId: '123456789',
    resourceId: 'abcdef',
    stage: 'dev',
    authorizer: {},
    requestId: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
    identity: {
      cognitoIdentityPoolId: null,
      accountId: null,
      cognitoIdentityId: null,
      caller: null,
      apiKey: '',
      sourceIp: '123.4.567.890',
      accessKey: null,
      cognitoAuthenticationType: null,
      cognitoAuthenticationProvider: null,
      userArn: null,
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 Safari/537.36',
      user: null,
    },
    resourcePath: '/some-path/',
    httpMethod: 'GET',
    apiId: 'abcdefghij',
  },
  body: '', // JSON
  isBase64Encoded: false,
})

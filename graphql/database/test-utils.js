/* eslint-env jest */

import databaseClient from './databaseClient'
import UserModel from './users/UserModel'

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
  GET_ALL: 'scan'
}

const availableOperations = [
  'batchGet',
  'batchWrite',
  'put',
  'get',
  'delete',
  'update',
  'scan',
  'query'
]

/**
 * Set a mock return function for a call to the database client.
 * @param {string} operation - The database operation to override
 * @param {*} operation - The value to return from the database client call.
 * @return {function} An instance of `jest.fn`, a mock function
 */
export const setMockDBResponse = function (operation, returnVal = null) {
  jest.mock('./databaseClient')
  if (availableOperations.indexOf(operation) === -1) {
    const dbOps = Object.keys(DatabaseOperation).join(', ')
    throw new Error(`Mock database operation must be one of: ${dbOps}`)
  }
  return databaseClient[operation]
    .mockImplementation((params, callback) => {
      callback(null, returnVal)
    })
}

/**
 * Set the `permissions` getter value for a model class.
 * @param {Object} modelClass - The model class (extended from BaseModel)
 * @param {Object} permissions - The permissions object
 * @return {null}
 */
export const setModelPermissions = function (modelClass, permissions) {
  Object.defineProperty(modelClass, 'permissions', {
    get: () => permissions
  })
}

/**
 * Set a getter value for a model class.
 * @param {Object} modelClass - The model class (extended from BaseModel)
 * @param {string} fieldName - The name of the field
 * @param {*} val - The value the getter should return
 * @return {null}
 */
export const setModelGetterField = function (modelClass, fieldName, val) {
  Object.defineProperty(modelClass, fieldName, {
    get: () => val,
    configurable: true
  })
}

/**
 * Overwrite the class methods that interact with the database
 * with mock functions.
 * @param {Object} modelClass - The model class (extended from BaseModel)
 */
export const mockQueryMethods = function (modelClass) {
  const methodsToMock = [
    'get',
    'getAll',
    'create',
    'update',
    // Do not mock query, which returns a chainable object.
    // Instead, mock our method that executes the query.
    '_execAsync'
  ]
  methodsToMock.forEach((methodName) => {
    modelClass[methodName] = jest.fn(() => Promise.resolve({'foo': 'bar'}))
  })

  // Mock the chainable query method.
  const mockQuery = require('./base/__mocks__/UserModel.query')
  modelClass.query = mockQuery
}

/**
 * Get a mock user object (as passed from GraphQL context).
 * @return {Object} The mock user.
 */
export const getMockUserContext = function () {
  return {
    id: '45bbefbf-63d1-4d36-931e-212fbe2bc3d9',
    username: 'MyName',
    email: 'foo@bar.com',
    emailVerified: true
  }
}

/**
 * Get a mock user info.
 * @return {Object} The mock user info object.
 */
export const getMockUserInfo = function () {
  return {
    id: '45bbefbf-63d1-4d36-931e-212fbe2bc3d9',
    username: 'MyName',
    email: 'foo@bar.com'
  }
}

/**
 * Get a mock User instance.
 * @param {Object} attributes - Attributes to override when getting the mock user.
 * @return {Object} The mock user.
 */
export const getMockUserInstance = function (attributes) {
  const defaultUserInfo = getMockUserInfo()
  const now = mockDate.defaultDate.toISOString()
  return new UserModel(Object.assign({}, defaultUserInfo, attributes, {
    created: now,
    updated: now
  }))
}

/**
 * Set the global `Date` to always return the same date.
 */
export const mockDate = {}
mockDate.defaultDate = new Date('2017-05-19T06:59:46')

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

  const constantDate = dateStr ? new Date(dateStr) : mockDate.defaultDate
  const mockCurrentTimeOnly = (
    !!options.mockCurrentTimeOnly
  )

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
export const addTimestampFieldsToItem = (item) => {
  const now = mockDate.defaultDate.toISOString()
  return Object.assign({}, item, {
    created: now,
    updated: now
  })
}

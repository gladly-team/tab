/* eslint-env jest */

import databaseClient from './databaseClient'

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
  if (availableOperations.indexOf(operation) === -1) {
    const dbOps = Object.keys(DatabaseOperation).join(', ')
    throw new Error(`Mock database operation must be one of: ${dbOps}`)
  }
  databaseClient[operation] = jest.fn((params, callback) => {
    callback(null, returnVal)
  })
  return databaseClient[operation]
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
export const getMockUserObj = function () {
  return {
    id: '45bbefbf-63d1-4d36-931e-212fbe2bc3d9',
    username: 'MyName',
    emailVerified: true
  }
}

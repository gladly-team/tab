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

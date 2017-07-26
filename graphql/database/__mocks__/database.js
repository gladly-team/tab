// TODO: delete this file

import { OperationType } from '../../utils/test-utils'
import {
  EmptyOperationStackException,
  OperationMissmatchException
} from '../../utils/exceptions'

class DatabaseMock {
  constructor () {
    this.store = []
  }

  init () {
    this.store = []
  }

  validateOperation (operation) {
    if (this.store.length === 0) {
      throw new EmptyOperationStackException()
    }

    if (this._operationMissmatch(operation)) {
      const expectedOperation = this.store[0].operation
      const receivedOperation = operation
      throw new OperationMissmatchException(expectedOperation, receivedOperation)
    }
  }

  pushDatabaseOperation (databaseOperation) {
    this.store.push(databaseOperation)
  }

  put (params) {
    this.validateOperation(OperationType.PUT)
    return this._resolveNext(params)
  }

  get (params) {
    this.validateOperation(OperationType.GET)
    return this._resolveNext(params)
  }

  batchGet (params) {
    this.validateOperation(OperationType.BATCHGET)
    return this._resolveNext(params)
  }

  query (params) {
    this.validateOperation(OperationType.QUERY)
    return this._resolveNext(params)
  }

  scan (params) {
    this.validateOperation(OperationType.SCAN)
    return this._resolveNext(params)
  }

  update (params) {
    this.validateOperation(OperationType.UPDATE)
    return this._resolveNext(params)
  }

  // Private methods...............................

  _operationMissmatch (operation) {
    return this.store[0].operation !== operation
  }

  _resolveNext (params) {
    const resolver = this.store[0].resolver
    const response = resolver(params)
    this.store.shift()
    return Promise.resolve(response)
  }
}

var Singleton = (function () {
  var mockDatabase

  function createDatabase () {
    var database = new DatabaseMock()
    return database
  }

  return {
    getDatabase: function () {
      if (!mockDatabase) {
        mockDatabase = createDatabase()
      }
      return mockDatabase
    }
  }
})()

export default Singleton.getDatabase()

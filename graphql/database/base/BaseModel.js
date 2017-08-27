
import moment from 'moment'
import { get, has } from 'lodash/object'
import { isObject, isFunction, isNil } from 'lodash/lang'

import dynogels from './dynogels-promisified'
import types from '../fieldTypes'
import {
  NotImplementedException,
  UnauthorizedQueryException
} from '../../utils/exceptions'
import dbClient from '../databaseClient'
import { isValidPermissionsOverride } from '../../utils/permissions-overrides'

dynogels.documentClient(dbClient)

class BaseModel {
  constructor (obj) {
    if (!obj || typeof obj !== 'object') {
      return
    }
    const fieldNames = [].concat(Object.keys(this.constructor.schema),
      ['created', 'updated'])
    const customDeserializers = this.constructor.fieldDeserializers
    const fieldDefaults = this.constructor.fieldDefaults
    fieldNames.forEach((fieldName) => {
      // Set properties for each field on the model.
      // * If `obj[fieldName]` exists, use the value of `obj[fieldName]`.
      // * Else, if `obj[fieldName]` does not exist, use the default value of
      //   the field if one exists.
      // * If a custom deserializer exists for that field, call it.
      // * If the final value is null or undefined, do not set
      //   the property.
      var val = null
      if (has(obj, fieldName)) {
        val = obj[fieldName]
      } else if (has(fieldDefaults, fieldName)) {
        var fieldDefault = fieldDefaults[fieldName]
        if (isFunction(fieldDefault)) {
          val = fieldDefault()
        } else {
          val = fieldDefault
        }
      }
      if (isFunction(get(customDeserializers, fieldName, false))) {
        let deserializeFunc = customDeserializers[fieldName]
        val = deserializeFunc(val, obj)
      }
      if (!isNil(val)) {
        this[fieldName] = val
      }
    })
  }

  /**
   * The name of the model.
   * You are required to override this function on the child class.
   * @return {string} The name of the model.
   */
  static get name () {
    throw new NotImplementedException()
  }

  /**
   * The name of the database table.
   * You are required to override this function on the child class.
   * @return {string} The name of the database table.
   */
  static get tableName () {
    throw new NotImplementedException()
  }

  /**
   * The name of the hashKey for the DynamoDB table.
   * You are required to override this function on the child class.
   * @return {string} The name of the hashKey for the DynamoDB table.
   */
  static get hashKey () {
    throw new NotImplementedException()
  }

  /**
   * The name of the range key (if it exists) for the DynamoDB table.
   * @return {string} The name of the hashKey for the DynamoDB table.
   */
  static get rangeKey () {
    return null
  }

  /**
   * Any secondary indexes on the model.
   * See:
   *   https://github.com/clarkie/dynogels#global-indexes
   *   https://github.com/clarkie/dynogels#local-secondary-indexes
   * @return {object} The name of the hashKey for the DynamoDB table.
   * @return {array<object>} indexes<index> - A list of index objects.
   * @return {string} index.hashKey - The hash key.
   * @return {string} index.rangeKey - The range key.
   * @return {string} index.name - The name of the index.
   * @return {string} index.type - Either "global" or "local".
   */
  static get indexes () {
    return null
  }

  /**
   * The table schema, used in dynogels.
   * You are required to override this function on the child class.
   * @return {object} The table schema.
   */
  static get schema () {
    throw new NotImplementedException()
  }

  /**
   * Default values for the fields in schema.
   * @return {object} A map of default values, keyed by field name.
   *   If a field's default value is a function, it will be called to
   *   generate the value.
   */
  static get fieldDefaults () {
    return {}
  }

  /**
   * Custom deserializers for field values.
   * @return {object} A map of deserizer functions, keyed by field name.
   *   Each function receives the field value and object and returns a value.
   *   The field deserializer will be called with the existing field value
   *   if one exists, falling back to calling with the field default value
   *   if one exists. If the fieldDeserializer returns undefined or null,
   *   we will not set the property.
   */
  static get fieldDeserializers () {
    return {}
  }

  /**
   * The permissions object, used to check authorization for database
   * operations. By default, no operations are authorized.
   * @return {object} The permissions object, with a key for each
   *   operation name. Each property value is a function that receives:
   *    - a userContext object
   *    - item hashKey (if getting a specific item)
   *    - item rangeKey (if one exists)
   *    - item object (if creating or updating an item)
   *   The authorizer function returns a boolean for whether the query is authorized.
   *   Secondary indexes must be authorized separately in `indexPermissions`,
   *   with a property key set to the name of the secondary index.
   */
  static get permissions () {
    return {
      get: (userContext, hashKeyValue, rangeKeyValue) => false,
      getAll: (userContext) => false,
      update: (userContext, hashKeyValue, rangeKeyValue, item) => false,
      create: (userContext, hashKeyValue, rangeKeyValue, item) => false,
      indexPermissions: {}
    }
  }

  /**
   * Register the model with dynogels. This must be called prior to
   * using any methods that query the database.
   * @return {undefined}
   */
  static register () {
    // console.log(`Registering model ${this.name} to table ${this.tableName}.`)

    // Add two ISO timestamps, 'created' and 'updated', to
    // the item's fields.
    const schema = Object.assign(this.schema, {
      created: types.string().isoDate(),
      updated: types.string().isoDate()
    })

    const options = {
      hashKey: this.hashKey,
      tableName: this.tableName,

      // Handle timestamps ourselves, not through dynogels.
      timestamps: false,

      schema: schema
    }
    if (this.rangeKey) {
      options['rangeKey'] = this.rangeKey
    }

    // Add any secondary indexes.
    // https://github.com/clarkie/dynogels#global-indexes
    if (this.indexes) {
      options.indexes = this.indexes
    }

    this.dynogelsModel = dynogels.define(this.name, options)
  }

  static async get (userContext, hashKey, rangeKey, options) {
    const self = this
    let keys = [hashKey]
    if (rangeKey) {
      keys.push(rangeKey)
    }
    // console.log(`Getting obj with hashKey ${hashKey} from table ${this.tableName}.`)
    if (!this.isQueryAuthorized(userContext, 'get', hashKey, rangeKey)) {
      return Promise.reject(new UnauthorizedQueryException())
    }
    return this.dynogelsModel.getAsync(...keys)
      .then(data => {
        if (isNil(data)) {
          throw new Error(`Could not get item with hash key ${hashKey}.`)
        }
        return self.deserialize(data)
      })
      .catch(err => {
        throw err
      })
  }

  // `keys` can be an array of hashKey strings or an array of objects
  // containing hashKeys and rangeKeys
  static async getBatch (userContext, keys) {
    const self = this
    // console.log(`Getting multiple objs with keys ${keys} from table ${this.tableName}.`)
    var authorizationError = false
    keys.forEach((key) => {
      var hashKey
      var rangeKey
      if (isObject(key)) {
        hashKey = get(key, [self.hashKey], null)
        rangeKey = get(key, [self.rangeKey], null)
      } else {
        hashKey = key
      }
      if (!this.isQueryAuthorized(userContext, 'get', hashKey, rangeKey)) {
        authorizationError = true
      }
    })
    if (authorizationError) {
      return Promise.reject(new UnauthorizedQueryException())
    }
    return this.dynogelsModel.getItemsAsync(keys)
      .then(data => self.deserialize(data))
      .catch(err => {
        console.log(err)
        return err
      })
  }

  static async getAll (userContext) {
    // console.log(`Getting all objs in table ${this.tableName}.`)
    const self = this
    if (!this.isQueryAuthorized(userContext, 'getAll')) {
      return Promise.reject(new UnauthorizedQueryException())
    }
    return this.dynogelsModel.scan().execAsync()
      .then(data => self.deserialize(data.Items))
      .catch(err => {
        console.log(err)
        return err
      })
  }

  static query (userContext, hashKey) {
    // console.log(`Querying hashKey ${hashKey} on table ${this.tableName}.`)

    // Return a dynogels chainable query, but use our own
    // `exec` function so we can deserialize the response.
    // Execute the query by calling `.execute()`.
    const queryObj = this.dynogelsModel.query(hashKey)
    queryObj.execute = async () => this._execAsync(userContext, hashKey, queryObj)
    return queryObj
  }

  static async _execAsync (userContext, hashKey, queryObj) {
    const self = this

    // See if this query is happening on an index.
    var indexName = null
    if (has(queryObj, 'request.IndexName')) {
      indexName = queryObj.request.IndexName
    }
    if (!this.isQueryAuthorized(userContext, 'get', hashKey, null, null, indexName)) {
      return Promise.reject(new UnauthorizedQueryException())
    }

    return queryObj.execAsync()
      .then(data => self.deserialize(data.Items))
      .catch(err => {
        console.log(err)
        return err
      })
  }

  static async create (userContext, item) {
    // console.log(`Creating item in ${this.tableName}: ${JSON.stringify(item, null, 2)}`)
    const self = this
    const hashKey = item[this.hashKey]

    // Add 'created' and 'updated' fields.
    item.created = moment.utc().toISOString()
    item.updated = moment.utc().toISOString()

    if (!this.isQueryAuthorized(userContext, 'create', hashKey, null, item)) {
      return Promise.reject(new UnauthorizedQueryException())
    }
    return this.dynogelsModel.createAsync(item)
      .then(data => self.deserialize(data))
      .catch(err => {
        console.log(err)
        return err
      })
  }

  static async update (userContext, item) {
    // console.log(`Updating item in ${this.tableName}: ${JSON.stringify(item, null, 2)}`)
    const self = this
    const hashKey = item[this.hashKey]
    const rangeKey = item[this.rangeKey]

    // Update 'updated' field.
    item.updated = moment.utc().toISOString()

    if (!this.isQueryAuthorized(userContext, 'update', hashKey, rangeKey, item)) {
      return Promise.reject(new UnauthorizedQueryException())
    }
    return this.dynogelsModel.updateAsync(item, { ReturnValues: 'ALL_NEW' })
      .then(data => self.deserialize(data))
      .catch(err => {
        console.log(err)
        return err
      })
  }

  /**
   * Return a modified object or list of object from the
   * database item or items.
   * @param {Object || Object[]} obj - The database object or list of objects.
   * @return {Object | Object[]} An instance of `this`, with the attributes
   *   of `obj` and possibly some additional default attributes.
  */
  static deserialize (data) {
    const deserializeObj = (item) => {
      // Item may be null.
      if (!item) {
        return null
      }

      // Create an instance of the model class so that we can use
      // the class type in `nodeDefinitions` in schema.
      const Cls = this
      return new Cls(item.attrs)
    }

    var result
    if (data instanceof Array) {
      result = []
      for (var index in data) {
        result.push(deserializeObj(data[index]))
      }
    } else {
      result = deserializeObj(data)
    }
    return result
  }

  /**
   * Determine whether the userContext is authorized to make a particular
   * database query.
   * @param {obj} userContext - The user object passed as context
   * @param {string} operation - The operation type (e.g. "get" or "update")
   * @param {string} hashKeyValue - The value of the item hashKey in the query
   * @param {string} rangeKeyValue - The value of the item rangeKey in the query
   * @param {object} item - An object of attributes to be updated or created
   * @param {string} indexName - The name of the secondary index, if querying
   *   a secondary index.
   * @return {boolean} Whether the userContext is authorized.
   */
  static isQueryAuthorized (userContext, operation, hashKeyValue = null,
    rangeKeyValue = null, item = null, indexName = null) {
    // Check if the DB call has an authorization override
    // that ignores the user-level permissions.
    if (isValidPermissionsOverride(userContext)) {
      return true
    }

    // If the userContext is null or not an object, reject.
    if (!userContext || typeof userContext !== 'object') {
      return false
    }

    const validOperations = [
      'get',
      'getAll',
      'update',
      'create'
    ]
    if (validOperations.indexOf(operation) === -1) {
      return false
    }

    // Get the permissions from the model class. If no permissions are
    // defined, do not allow any access.
    const permissions = this.permissions
    if (!permissions) {
      return false
    }

    // Get the authorizer function from the model class for this operation.
    // If the function does not exist, do not allow any access.
    // If this operation is happening on a secondary index, get the authorizer
    // function for that index.
    var authorizerFunction
    if (indexName) {
      authorizerFunction = get(permissions, ['indexPermissions', indexName, operation])
    } else {
      authorizerFunction = get(permissions, [operation])
    }
    if (!authorizerFunction || !(typeof authorizerFunction === 'function')) {
      return false
    }

    // If the authorizer function returns `true`, the query is authorized.
    var isAuthorized = false
    try {
      isAuthorized = (authorizerFunction(userContext, hashKeyValue,
        rangeKeyValue, item, indexName)) === true
    } catch (err) {
      isAuthorized = false
      console.log(err)
    }
    return isAuthorized
  }
}

export default BaseModel

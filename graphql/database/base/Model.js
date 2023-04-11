import moment from 'moment'
import { get, has } from 'lodash/object'
import { isObject, isFunction, isNil } from 'lodash/lang'

import {
  DatabaseConditionalCheckFailedException,
  DatabaseItemDoesNotExistException,
  NotImplementedException,
  UnauthorizedQueryException,
} from '../../utils/exceptions'
import { isValidPermissionsOverride } from '../../utils/permissions-overrides'
import logger from '../../utils/logger'

class Model {
  constructor(obj) {
    if (!obj || typeof obj !== 'object') {
      return
    }
    const fieldNames = [].concat(Object.keys(this.constructor.schema), [
      'created',
      'updated',
    ])
    const customDeserializers = this.constructor.fieldDeserializers
    const { fieldDefaults } = this.constructor

    // Set properties for each field on the model.
    // * If `obj[fieldName]` exists, use the value of `obj[fieldName]`.
    // * Else, if `obj[fieldName]` does not exist, use the default value of
    //   the field if one exists.
    // * If both the value and default value are nil, do not set
    //   the property.
    fieldNames.forEach((fieldName) => {
      let val = null
      if (has(obj, fieldName)) {
        val = obj[fieldName]
      } else if (has(fieldDefaults, fieldName)) {
        const fieldDefault = fieldDefaults[fieldName]
        if (isFunction(fieldDefault)) {
          val = fieldDefault()
        } else {
          val = fieldDefault
        }
      }
      if (!isNil(val)) {
        // TODO: clean up the logic in this constructor to use immutable variables.
        // eslint-disable-next-line no-param-reassign
        obj[fieldName] = val
      }
    })

    // Call any custom deserializers on the fields.
    // * If a custom deserializer exists for that field, call it.
    // * If the returned value is null or undefined, do not set
    //   the property.
    const self = this
    fieldNames.forEach((fieldName) => {
      let val = null
      if (has(obj, fieldName)) {
        val = obj[fieldName]
      }
      if (isFunction(get(customDeserializers, fieldName, false))) {
        const deserializeFunc = customDeserializers[fieldName]
        val = deserializeFunc(val, obj)
      }
      if (!isNil(val)) {
        self[fieldName] = val
      }
    })
  }

  static register() {
    try {
      // Kind of dumb logic for now, just makes sure all expected internal methods are defined.
      /* eslint-disable no-unused-expressions */
      this.schema
      this.hashKey
      this.name
      /* eslint-enable no-unused-expressions */
    } catch (e) {
      throw new Error(
        'Model is missing a required field (schema, hashKey or name)'
      )
    }
  }

  /**
   * The name of the model.
   * You are required to override this function on the child class.
   * @return {string} The name of the model.
   */
  static get name() {
    throw new NotImplementedException()
  }

  /**
   * The name of the hashKey for the table.
   * You are required to override this function on the child class.
   * @return {string} The name of the hashKey for the table.
   */
  static get hashKey() {
    throw new NotImplementedException()
  }

  /**
   * The name of the range key (if it exists) for the table.
   * @return {string} The name of the hashKey for the table.
   */
  static get rangeKey() {
    return null
  }

  /**
   * The table schema.
   * You are required to override this function on the child class.
   * @return {object} The table schema.
   */
  static get schema() {
    throw new NotImplementedException()
  }

  /**
   * Default values for the fields in schema.
   * @return {object} A map of default values, keyed by field name.
   *   If a field's default value is a function, it will be called to
   *   generate the value.
   */
  static get fieldDefaults() {
    return {}
  }

  /**
   * Custom deserializers for field values.
   * @return {object} A map of deserializer functions, keyed by field name.
   *   Each function receives the field value and object and returns a value.
   *   The field deserializer will be called with the existing field value
   *   if one exists, falling back to calling with the field default value
   *   if one exists. If the fieldDeserializer returns undefined or null,
   *   we will not set the property.
   */
  static get fieldDeserializers() {
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
  static get permissions() {
    return {
      // Receives: userContext, hashKeyValue, rangeKeyValue
      get: () => false,
      // Receives: userContext
      getAll: () => false,
      // Receives: userContext, hashKeyValue, rangeKeyValue, item
      update: () => false,
      // Receives: userContext, hashKeyValue, rangeKeyValue, item
      create: () => false,
    }
  }

  static async getInternal() {
    throw new NotImplementedException()
  }

  static async get(userContext, key) {
    let hashKey
    let rangeKey
    // Required for RedisModel
    if (Array.isArray(key)) {
      ;[hashKey, rangeKey] = key
    } else {
      hashKey = key
      rangeKey = null
    }
    // logger.debug(`Getting obj with hashKey ${hashKey} from table ${this.tableName}.`)
    if (!this.isQueryAuthorized(userContext, 'get', hashKey, rangeKey)) {
      throw new UnauthorizedQueryException()
    }
    try {
      const data = await this.getInternal(key)
      if (isNil(data)) {
        throw new DatabaseItemDoesNotExistException()
      }
      return this.deserialize(data)
    } catch (e) {
      throw e
    }
  }

  static async getOrNull(userContext, key) {
    try {
      return await this.get(userContext, key)
    } catch (e) {
      if (e.code === DatabaseItemDoesNotExistException.code) {
        return null
      }
      throw e
    }
  }

  static async getBatchInternal() {
    throw new NotImplementedException()
  }

  // `keys` can be an array of hashKey strings or an array of objects
  // containing hashKeys and rangeKeys
  static async getBatch(userContext, keys, options) {
    const self = this
    // logger.debug(`Getting multiple objs with keys ${JSON.stringify(keys)} from table ${this.tableName}.`)
    let authorizationError = false
    keys.forEach((key) => {
      let hashKey
      let rangeKey
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
      throw new UnauthorizedQueryException()
    }
    try {
      const data = await this.getBatchInternal(keys, options)
      return this.deserialize(data)
    } catch (e) {
      throw e
    }
  }

  static async getAllInternal() {
    throw new NotImplementedException()
  }

  static async getAll(userContext) {
    // logger.debug(`Getting all objs in table ${this.tableName}.`)
    if (!this.isQueryAuthorized(userContext, 'getAll')) {
      throw new UnauthorizedQueryException()
    }
    try {
      const data = await this.getAllInternal()
      return this.deserialize(data)
    } catch (e) {
      throw e
    }
  }

  static async createInternal() {
    throw new NotImplementedException()
  }

  /**
   * Create a new item.
   * @param {Object} userContext - The authed user context
   * @param {Object} item - The item to create
   * @param {boolean} overwrite - Whether to overwrite an existing item
   *   if one exists with the same hash key
   * @return {Object} item - The created item
   */
  static async create(userContext, item, overwrite = false) {
    // logger.debug(`Creating item in ${this.tableName}: ${JSON.stringify(item, null, 2)}`)
    const hashKey = item[this.hashKey]
    const rangeKey = item[this.rangeKey]
    // Add 'created' and 'updated' fields if they're not already set.
    if (!item.created) {
      // TODO: fix rule violation
      // eslint-disable-next-line no-param-reassign
      item.created = moment.utc().toISOString()
    }
    if (!item.updated) {
      // TODO: fix rule violation
      // eslint-disable-next-line no-param-reassign
      item.updated = moment.utc().toISOString()
    }

    if (
      !this.isQueryAuthorized(userContext, 'create', hashKey, rangeKey, item)
    ) {
      throw new UnauthorizedQueryException()
    }
    const fetchedItem = await this.createInternal(item, overwrite)
    return this.deserialize(fetchedItem)
  }

  /**
   * Create a new item, or fetch it if it already exists.
   * @param {Object} userContext - The authed user context
   * @param {Object} item - The item to create
   * @return {Object} response
   * @return {boolean} response.created - Whether the item did not
   *   previously exist and was created
   * @return {Object} response.item - The created item (or fetched item if it
   *   already existed and `overwrite` is false)
   */
  static async getOrCreate(userContext, item) {
    try {
      const createdItem = await this.create(userContext, item, false)
      return {
        created: true,
        item: createdItem,
      }
    } catch (e) {
      // Overwrite is false and the item already existed.
      // Get the item and return it.
      if (e.code === DatabaseConditionalCheckFailedException.code) {
        const hashKey = item[this.hashKey]
        let rangeKey
        if (this.rangeKey) {
          rangeKey = item[this.rangeKey]
        }
        const fetchedItem = await this.get(userContext, hashKey, rangeKey)
        return {
          created: false,
          item: fetchedItem,
        }
      }

      // Some other error we can't handle.
      throw e
    }
  }

  static async updateInternal() {
    throw new NotImplementedException()
  }

  /**
   * Update an item.
   * @param {Object} userContext - The authed user context
   * @param {Object} item - The item to update
   * @param {(Object|null)} params - The update options, including conditional
   *   update expressions. See:
   *   http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ConditionExpressions.html#Expressions.ConditionExpressions.SimpleComparisons
   * @return {Object} item - The updated item
   */
  static async update(userContext, item, params = {}) {
    // logger.debug(`Updating item in ${this.tableName}: ${JSON.stringify(item, null, 2)}`)
    const hashKeyValue = item[this.hashKey]
    const rangeKeyValue = item[this.rangeKey]

    // Update 'updated' field if it's not already set.
    if (!item.updated) {
      // TODO: fix rule violation
      // eslint-disable-next-line no-param-reassign
      item.updated = moment.utc().toISOString()
    }

    if (
      !this.isQueryAuthorized(
        userContext,
        'update',
        hashKeyValue,
        rangeKeyValue,
        item
      )
    ) {
      throw new UnauthorizedQueryException()
    }

    const updatedItem = await this.updateInternal(item, params)
    return this.deserialize(updatedItem)
  }

  /**
   * Return a modified object or list of object from the
   * database item or items.
   * @param {Object || Object[]} obj - The database object or list of objects.
   * @return {Object | Object[]} An instance of `this`, with the attributes
   *   of `obj` and possibly some additional default attributes.
   */
  static deserialize(data) {
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

    let result
    if (data instanceof Array) {
      result = data.map((val) => deserializeObj(val))
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
  static isQueryAuthorized(
    userContext,
    operation,
    hashKeyValue = null,
    rangeKeyValue = null,
    item = null,
    indexName = null
  ) {
    // Check if the DB call has an authorization override
    // that ignores the user-level permissions.
    if (isValidPermissionsOverride(userContext)) {
      return true
    }
    // If the userContext is null or not an object, reject.
    if (!userContext || typeof userContext !== 'object') {
      return false
    }
    const validOperations = ['get', 'getAll', 'update', 'create']
    if (validOperations.indexOf(operation) === -1) {
      return false
    }
    // Get the permissions from the model class. If no permissions are
    // defined, do not allow any access.
    const { permissions } = this
    if (!permissions) {
      return false
    }
    // Get the authorizer function from the model class for this operation.
    // If the function does not exist, do not allow any access.
    // If this operation is happening on a secondary index, get the authorizer
    // function for that index.
    let authorizerFunction
    if (indexName) {
      authorizerFunction = get(permissions, [
        'indexPermissions',
        indexName,
        operation,
      ])
    } else {
      authorizerFunction = get(permissions, [operation])
    }
    if (!authorizerFunction || !(typeof authorizerFunction === 'function')) {
      return false
    }
    // If the authorizer function returns `true`, the query is authorized.
    let isAuthorized = false
    try {
      isAuthorized =
        authorizerFunction(
          userContext,
          hashKeyValue,
          rangeKeyValue,
          item,
          indexName
        ) === true
    } catch (err) {
      isAuthorized = false
      logger.error(err)
    }
    return isAuthorized
  }
}

export default Model

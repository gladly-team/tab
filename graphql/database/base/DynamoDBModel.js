import { has } from 'lodash/object'
import { isNil } from 'lodash/lang'
import Model from './Model'
import dynogels from './dynogels-promisified'
import dbClient from '../databaseClient'
import types from '../fieldTypes'
import {
  DatabaseConditionalCheckFailedException,
  DatabaseItemDoesNotExistException,
  UnauthorizedQueryException,
} from '../../utils/exceptions'

dynogels.documentClient(dbClient)

const AWSConditionalCheckFailedErrorCode = 'ConditionalCheckFailedException'

class DynamoDBModel extends Model {
  /**
   * Register the model with dynogels. This must be called prior to
   * using any methods that query the database.
   * @return {undefined}
   */
  static register() {
    // logger.debug(`Registering model ${this.name} to table ${this.tableName}.`)

    // Add two ISO timestamps, 'created' and 'updated', to
    // the item's fields.
    const schema = Object.assign(this.schema, {
      created: types.string().isoDate(),
      updated: types.string().isoDate(),
    })

    const options = {
      hashKey: this.hashKey,
      tableName: this.tableName,

      // Handle timestamps ourselves, not through dynogels.
      timestamps: false,

      // Options passed to Joi.
      validation: {
        // Do not allow casting values during validation.
        // https://github.com/hapijs/joi/blob/v14.3.1/API.md#validatevalue-schema-options-callback
        convert: false,
      },

      schema,
    }
    if (this.rangeKey) {
      options.rangeKey = this.rangeKey
    }

    // Add any secondary indexes.
    // https://github.com/clarkie/dynogels#global-indexes
    if (this.indexes) {
      options.indexes = this.indexes
    }

    this.dynogelsModel = dynogels.define(this.name, options)
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
  static get indexes() {
    return null
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
      indexPermissions: {},
    }
  }

  static async get(userContext, hashKey, rangeKey) {
    const keys = [hashKey]
    if (rangeKey) {
      keys.push(rangeKey)
    }
    // logger.debug(`Getting obj with hashKey ${hashKey} from table ${this.tableName}.`)
    if (!this.isQueryAuthorized(userContext, 'get', hashKey, rangeKey)) {
      throw new UnauthorizedQueryException()
    }
    try {
      const data = await this.dynogelsModel.getAsync(...keys)
      if (isNil(data)) {
        throw new DatabaseItemDoesNotExistException()
      }
      return this.deserialize(data)
    } catch (e) {
      throw e
    }
  }

  static async getInternal(keys) {
    return this.dynogelsModel.getAsync(...keys)
  }

  static async getBatchInternal(keys, options) {
    return this.dynogelsModel.getItemsAsync(keys, options)
  }

  static async getAllInternal() {
    const items = await this.dynogelsModel
      .scan()
      .loadAll()
      .execAsync()
    return items.Items
  }

  static query(userContext, hashKey) {
    // logger.debug(`Querying hashKey ${hashKey} on table ${this.tableName}.`)

    // Return a dynogels chainable query, but use our own
    // `exec` function so we can deserialize the response.
    // Execute the query by calling `.execute()`.
    const queryObj = this.dynogelsModel.query(hashKey)
    queryObj.execute = async () =>
      this._execAsync(userContext, hashKey, queryObj)
    return queryObj
  }

  static async _execAsync(userContext, hashKey, queryObj) {
    // See if this query is happening on an index.
    let indexName = null
    if (has(queryObj, 'request.IndexName')) {
      indexName = queryObj.request.IndexName
    }
    if (
      !this.isQueryAuthorized(
        userContext,
        'get',
        hashKey,
        null,
        null,
        indexName
      )
    ) {
      throw new UnauthorizedQueryException()
    }

    try {
      const data = await queryObj.execAsync()
      return this.deserialize(data.Items)
    } catch (e) {
      throw e
    }
  }

  static async createInternal(item, overwrite = false) {
    try {
      return await this.dynogelsModel.createAsync(item, {
        overwrite,
      })
    } catch (e) {
      if (e.code === AWSConditionalCheckFailedErrorCode) {
        throw new DatabaseConditionalCheckFailedException()
      }

      throw e
    }
  }

  static async updateInternal(item, params = {}) {
    // TODO: fix rule violation
    // eslint-disable-next-line no-param-reassign
    params.ConditionExpression = params.ConditionExpression
      ? `${params.ConditionExpression} AND attribute_exists(${this.hashKey})`
      : `attribute_exists(${this.hashKey})`

    const options = Object.assign({}, params, { ReturnValues: 'ALL_NEW' })
    try {
      return await this.dynogelsModel.updateAsync(item, options)
    } catch (e) {
      if (e.code === AWSConditionalCheckFailedErrorCode) {
        throw new DatabaseConditionalCheckFailedException()
      }
      throw e
    }
  }
}

export default DynamoDBModel

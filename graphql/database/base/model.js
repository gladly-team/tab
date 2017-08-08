// TODO: delete this file
import uuid from 'uuid/v4'
import database from '../database'
import { listToString } from '../utils'
import { NotImplementedException } from '../../utils/exceptions'
import moment from 'moment'

// Consider an authorization layer here. This could be additional
// security on top of AWS IAM Policy restrictions.
// See: http://graphql.org/learn/authorization/
/*
 * Class representing a BaseModel.
 * BaseModel is the parent class of all our Model classes.
 */
class BaseModel {
  /**
   * Create a BaseModel instance.
   * You will never have to call this directly but from a child class constructor.
   * If no id is provided it will generate a new one for the resulting instance.
   * @param {Object} id - The instance id in the database.
   */
  constructor (id) {
    this.id = id || uuid()
    this.updated = ''
    this.created = ''
  }

  /**
   * Gets the key object from data. By default assume that data
   * is a primitive type and that the KeyName for this type is id.
   * Override in the child class to get a different behavior.
   * @param {Object} data
   * @return {Object} Key for this type.
   */
  static getKey (data) {
    return {
      id: data
    }
  }

  /**
   * Get the object with the respective id from the database.
   * @param {Object} id
   * @param {Object} [args={}] optional query parameters.
   * @return {Promise<BaseModel>} A promise that resolve into an
   * object from the child class.
   */
  static get (id, args = {}) {
    const key = this.getKey(id)

    var params = Object.assign({}, {
      TableName: this.getTableName(),
      Key: key
    }, args)

    const self = this
    return database.get(params).then(data => {
      return self.deserialize(data['Item'])
    })
  }

  /**
   * Get the object with the respective id from the database.
   * @param {Object} id
   * @param {Object} [args={}] optional query parameters.
   * @return {Promise<BaseModel>} A promise that resolve into an
   * object from the child class.
   */
  static getAll (args = {}) {
    var params = Object.assign({}, {
      TableName: this.getTableName()
    }, args)

    const self = this
    return database.scan(params).then(data => {
      return self.deserialize(data.Items)
    })
  }

  /**
   * Get a batch of objects with the specified ids.
   * @param {Object[]} keys The keys to fetch from the database
   * @param {Object} [args={}] optional query parameters.
   * @return {Promise<BaseModel[]>} A promise that resolve
   * into an array of objects from the child class.
   */
  static getBatch (keys, args = {}) {
    var params = {}
    params['RequestItems'] = {}
    params['RequestItems'][this.getTableName()] = Object.assign({}, {
      Keys: keys
    }, args)

    const self = this
    return database.batchGet(params).then(data => {
      const items = data['Responses'][self.getTableName()]
      const result = []
      for (var index in items) {
        result.push(self.deserialize(items[index]))
      }
      return result
    })
  }

  /**
   * Query the database with the given arguments.
   * @param {Object} args optional query parameters.
   * @return {Promise<BaseModel[]>} A promise that resolve
   * into an array of objects from the child class.
   */
  static query (args = {}) {
    var params = Object.assign({}, {
      TableName: this.getTableName()
    }, args)

    const self = this
    return database.query(params).then(data => {
      const result = []
      const items = data.Items
      for (var index in items) {
        result.push(self.deserialize(items[index]))
      }
      return result
    })
  }

  /**
   * Add the given item to the child class table.
   * @param {Object} item optional query parameters.
   * @param {Object} args={} query parameters.
   * @return {Promise} A promise that resolve into the db response.
   */
  static add (item, args = {}) {
    const finalItem = Object.assign({},
      item, {
        updated: moment.utc().toISOString(),
        created: moment.utc().toISOString()
      })

    var params = Object.assign({}, {
      TableName: this.getTableName(),
      Item: finalItem
    }, args)

    return database.put(params).then(data => {
      return { Item: item, Data: data }
    })
  }

  /**
   * Update the item with the specified Id from the child class table.
   * @param {Object} id the item id to update.
   * @param {Object} args={} query parameters.
   * @return {Promise<BaseModel>} A promise that resolve
   * into an instance of the child class.
   */
  static update (id, config, args = {}) {
    const key = this.getKey(id)

    if (args.hasOwnProperty('UpdateExpression')) {
      throw new Error(`You included an invalid param <UpdateExpression> into the args.
        Use config to define the update expression for the update method.`)
    }

    const finalArgs = this.updateArgsBuilder(args)

    var params = {
      TableName: this.getTableName(),
      Key: key,
      UpdateExpression: this.updateExpressionBuilder(config),
      ...finalArgs
    }

    const self = this
    return database.update(params).then(data => {
      const updatedUser = self.deserialize(data.Attributes)
      return updatedUser
    })
  }

  /**
   * Gets the child class table name in the database.
   * You are requiered to override this function on the child class.
   * @return {string} The name of the child class table in the database.
   */
  static getTableName () {
    throw new NotImplementedException()
  }

  /**
   * Gets the list of fields that map to the table attributes of the
   * child class.
   * You are requiered to override this function on the child class.
   * @return {string[]} The list of field names.
   */
  static getFields () {
    throw new NotImplementedException()
  }

  /**
   * Adds to the update operation args the updated attribute to
   * the attribute definition. The updated attribute is then use
   * by the updateExpressionBuilder to set the updated datetime
   * for an item.
   * @param {Object} The update expresion args.
   * @return {Object} The update expresion args with the update attribute.
  */
  static updateArgsBuilder (args) {
    const updatedExpressionAttributeNames = {
      '#updated': 'updated',
      '#created': 'created'
    }

    const updatedExpressionAttributeValues = {
      ':updated': moment.utc().toISOString(),
      ':created': moment.utc().toISOString()
    }

    if (!args.hasOwnProperty('ExpressionAttributeNames')) {
      args['ExpressionAttributeNames'] = {}
    }

    if (!args.hasOwnProperty('ExpressionAttributeValues')) {
      args['ExpressionAttributeValues'] = {}
    }

    args['ExpressionAttributeNames'] = Object.assign({},
      args['ExpressionAttributeNames'], updatedExpressionAttributeNames)

    args['ExpressionAttributeValues'] = Object.assign({},
      args['ExpressionAttributeValues'], updatedExpressionAttributeValues)

    return args
  }

  /**
   * Gets an object where the keys are the update expresion operations
   * set|add|remove|delete and the values of each expression in a list and
   * output the update expresion string.
   * Check docs at http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_UpdateItem.html#DDB-UpdateItem-request-UpdateExpression
   * @param {Object} The update expresion configuration.
   * @return {String} The update expresion string to use in update.
  */
  static updateExpressionBuilder (config) {
    if (!config) { throw new Error('Empty update expression config received.') }

    var setOp = ''
    var addOp = ''
    var removeOp = ''
    var deleteOp = ''

    for (var key in config) {
      var fieldName = key.toLowerCase()
      switch (fieldName) {
        case 'set':
          if (setOp) {
            throw new Error(`Invalid Update expression config received. 
              Duplicated declaration of operation set. Check your config.`)
          }

          setOp += 'SET ' + listToString(config[key], ',')
          break
        case 'add':
          if (addOp) {
            throw new Error(`Invalid Update expression config received. 
              Duplicated declaration of operation set. Check your config.`)
          }

          addOp += 'ADD ' + listToString(config[key], ',')
          break
        case 'remove':
          if (removeOp) {
            throw new Error(`Invalid Update expression config received. 
              Duplicated declaration of operation set. Check your config.`)
          }

          removeOp += 'REMOVE ' + listToString(config[key], ',')
          break
        case 'delete':
          if (deleteOp) {
            throw new Error(`Invalid Update expression config received. 
              Duplicated declaration of operation set. Check your config.`)
          }

          deleteOp += 'DELETE ' + listToString(config[key], ',')
          break
        default:
          throw new Error(`Invalid Update expression config received. 
            Expected set|add|remove|delete and got ` + key)
      }
    }

    // Add the last time updated to the expression.
    if (setOp === '') { setOp += 'SET ' } else { setOp += ',' }
    setOp += '#updated = :updated,#created = if_not_exists(#created, :created)'

    var result = [setOp]
    if (addOp !== '') { result.push(addOp) }
    if (removeOp !== '') { result.push(removeOp) }
    if (deleteOp !== '') { result.push(deleteOp) }

    return listToString(result, ' ')
  }

  /**
   * Converts from a database object or
   * list of objects to a child class object.
   * @param {Object || Object[]} The database object or list of objects.
   * @return {BaseModel | BaseModel[]} the child class object or list.
  */
  static deserialize (obj) {
    const self = this
    const deserializeObj = (obj) => {
      const Cls = self
      const id = obj.hasOwnProperty('id') ? obj['id'] : ''
      const instance = new Cls(id)

      var field = ''
      const fields = self.getFields()
      var defaultValue
      var value
      for (var index in fields) {
        field = fields[index]
        value = obj[field]
        defaultValue = instance[field]

        if (!obj.hasOwnProperty(field)) {
          instance[field] = defaultValue
        } else if (value === parseInt(value, 10)) {
          instance[field] = value
        } else {
          instance[field] = obj[field] || instance[field]
        }
      }

      // Add created and updated.
      instance.updated = obj.hasOwnProperty('updated') ? obj['updated'] : ''
      instance.created = obj.hasOwnProperty('created') ? obj['created'] : ''

      return instance
    }

    if (obj instanceof Array) {
      const result = []
      for (var index in obj) {
        result.push(deserializeObj(obj[index]))
      }
      return result
    }

    return deserializeObj(obj)
  }
}

export default BaseModel

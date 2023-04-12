// eslint-disable-next-line import/no-unresolved
import { Redis } from '@upstash/redis/with-fetch'
import Model from './Model'
import config from '../../config'
import {
  DatabaseConditionalCheckFailedException,
  DatabaseItemDoesNotExistException,
  FieldDoesNotExistException,
  UnauthorizedQueryException,
} from '../../utils/exceptions'
import types from '../fieldTypes'

class RedisModel extends Model {
  static getClient() {
    const client = new Redis({
      url: config.UPSTASH_REDIS_REST_URL,
      token: config.UPSTASH_REDIS_REST_TOKEN,
    })

    return client
  }

  static async getInternal(key) {
    const redisClient = this.getClient()
    const redisKey = this.getRedisKey(key)
    const item = await redisClient.hgetall(redisKey)
    if (item === null) {
      throw new DatabaseItemDoesNotExistException()
    }

    return this.postProcessObject(item)
  }

  static async getBatchInternal(keys) {
    const items = keys.map((key) => this.getInternal(key))
    return Promise.all(items)
  }

  static async createInternal(item, overwrite = false) {
    const redisClient = this.getClient()
    const redisKey = this.getRedisKey(item[this.hashKey])
    if (!overwrite) {
      const existingEntry = await redisClient.hgetall(redisKey)
      if (existingEntry !== null) {
        throw new DatabaseConditionalCheckFailedException()
      }
    }

    await redisClient.hset(redisKey, item)

    const object = await redisClient.hgetall(redisKey)
    return this.postProcessObject(object)
  }

  static async updateInternal(item) {
    const redisClient = this.getClient()
    const redisKey = this.getRedisKey(item[this.hashKey])
    const existingEntry = await redisClient.hgetall(redisKey)
    if (existingEntry === null) {
      throw new DatabaseItemDoesNotExistException()
    }

    await redisClient.hset(redisKey, item)

    const object = await redisClient.hgetall(redisKey)
    return this.postProcessObject(object)
  }

  static async updateField(userContext, id, field, value) {
    if (!this.isQueryAuthorized(userContext, 'update', id)) {
      throw new UnauthorizedQueryException()
    }

    if (this.schema[field] === undefined) {
      throw new FieldDoesNotExistException()
    }

    const redisKey = this.getRedisKey(id)
    const redisClient = this.getClient()
    const result = await redisClient.hget(redisKey, field)

    if (result === null) {
      throw new DatabaseItemDoesNotExistException()
    }

    const obj = {}
    obj[field] = value
    await redisClient.hset(redisKey, obj)
    return this.validateAndConvertField(field, value)
  }

  static async updateIntegerFieldBy(userContext, id, field, increment) {
    if (!this.isQueryAuthorized(userContext, 'update', id)) {
      throw new UnauthorizedQueryException()
    }

    if (types.number().integer().validate(increment).error) {
      throw new Error('Increment amount should be an integer')
    }

    if (this.schema[field] === undefined) {
      throw new FieldDoesNotExistException()
    }

    const redisKey = this.getRedisKey(id)
    const redisClient = this.getClient()
    const result = await redisClient.hget(redisKey, field)

    if (result === null) {
      throw new DatabaseItemDoesNotExistException()
    }

    if (types.number().integer().validate(result).error) {
      throw new Error('Field to update should be an integer')
    }

    await redisClient.hincrby(redisKey, field, increment)
    const resultingValue = await redisClient.hget(redisKey, field)
    return this.validateAndConvertField(field, resultingValue)
  }

  static async getField(userContext, id, field) {
    const redisClient = this.getClient()
    if (!this.isQueryAuthorized(userContext, 'get', id)) {
      throw new UnauthorizedQueryException()
    }

    if (this.schema[field] === undefined) {
      throw new FieldDoesNotExistException()
    }

    const redisKey = this.getRedisKey(id)
    const result = await redisClient.hget(redisKey, field)
    if (result === null) {
      throw new DatabaseItemDoesNotExistException()
    }

    return this.validateAndConvertField(field, result)
  }

  static async delete(key) {
    const redisClient = this.getClient()
    const redisKey = this.getRedisKey(key)
    const item = await redisClient.del(redisKey)

    if (item === 0) {
      throw new DatabaseItemDoesNotExistException()
    }
  }

  // Wraps the object in the expected format for Model.js.
  static async postProcessObject(dataPromise) {
    const rawObject = await dataPromise
    return {
      attrs: this.validateAndConvertObject(rawObject),
    }
  }

  // Validates each field on an object. Also makes sure that
  // objects are cast to their correct types.
  static validateAndConvertObject(rawObject) {
    const objectToReturn = Object.assign({}, rawObject)
    Object.keys(objectToReturn).forEach((field) => {
      objectToReturn[field] = this.validateAndConvertField(
        field,
        objectToReturn[field]
      )
    })
    return objectToReturn
  }

  static validateAndConvertField(field, fieldValue) {
    if (this.schema[field]) {
      const validateResult = this.schema[field].validate(fieldValue, {
        convert: true,
      })
      // todo: @jedtan Implement Solution here for RedisModels
      // https://github.com/hapijs/joi/issues/1442
      return validateResult.value
    }
    return fieldValue
  }

  static getRedisKey(hashKey) {
    return `${this.name}_${hashKey}`
  }
}

export default RedisModel

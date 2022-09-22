import Redis from 'ioredis'
import Model from './Model'
import {
  DatabaseConditionalCheckFailedException,
  DatabaseItemDoesNotExistException,
  FieldDoesNotExistException,
  UnauthorizedQueryException,
} from '../../utils/exceptions'
import types from '../fieldTypes'

const client = new Redis(process.env.UPSTASH_HOST)

class RedisModel extends Model {
  static async getInternal(key) {
    const redisKey = this.getRedisKey(key)
    const item = await client.hgetall(redisKey)
    if (Object.keys(item).length === 0) {
      throw new DatabaseItemDoesNotExistException()
    }
    return this.postProcessObject(item)
  }

  static async getBatchInternal(keys) {
    const items = keys.map(key => this.getInternal(key))
    return Promise.all(items)
  }

  static async createInternal(item, overwrite = false) {
    const redisKey = this.getRedisKey(item.id)
    if (!overwrite) {
      const existingEntry = await client.hgetall(redisKey)
      if (Object.keys(existingEntry).length !== 0) {
        throw new DatabaseConditionalCheckFailedException()
      }
    }

    await Promise.all(
      Object.entries(item).map(([key, value]) =>
        client.hset(redisKey, key, value)
      )
    )
    return this.postProcessObject(client.hgetall(redisKey))
  }

  static async updateInternal(item) {
    const redisKey = this.getRedisKey(item[this.hashKey])
    const existingEntry = await client.hgetall(redisKey)
    if (Object.keys(existingEntry).length === 0) {
      throw new DatabaseItemDoesNotExistException()
    }

    Object.entries(item).forEach(([key, value]) => {
      client.hset(redisKey, key, value)
    })

    return this.postProcessObject(client.hgetall(redisKey))
  }

  static async updateField(userContext, id, field, value) {
    if (!this.isQueryAuthorized(userContext, 'update', id)) {
      throw new UnauthorizedQueryException()
    }

    if (this.schema[field] === undefined) {
      throw new FieldDoesNotExistException()
    }

    const redisKey = this.getRedisKey(id)
    const result = await client.hget(redisKey, field)

    if (result === null) {
      throw new DatabaseItemDoesNotExistException()
    }

    await client.hset(redisKey, field, value)
    return this.validateAndConvertField(field, value)
  }

  static async updateIntegerFieldBy(userContext, id, field, increment) {
    if (!this.isQueryAuthorized(userContext, 'update', id)) {
      throw new UnauthorizedQueryException()
    }

    if (
      types
        .number()
        .integer()
        .validate(increment).error
    ) {
      throw new Error('Increment amount should be an integer')
    }

    if (this.schema[field] === undefined) {
      throw new FieldDoesNotExistException()
    }

    const redisKey = this.getRedisKey(id)
    const result = await client.hget(redisKey, field)

    if (result === null) {
      throw new DatabaseItemDoesNotExistException()
    }

    if (
      types
        .number()
        .integer()
        .validate(result).error
    ) {
      throw new Error('Field to update should be an integer')
    }

    await client.hincrby(redisKey, field, increment)
    return this.validateAndConvertField(
      field,
      await client.hget(redisKey, field)
    )
  }

  static async getField(userContext, id, field) {
    if (!this.isQueryAuthorized(userContext, 'get', id)) {
      throw new UnauthorizedQueryException()
    }

    if (this.schema[field] === undefined) {
      throw new FieldDoesNotExistException()
    }

    const redisKey = this.getRedisKey(id)
    const result = await client.hget(redisKey, field)
    if (result === null) {
      throw new DatabaseItemDoesNotExistException()
    }

    return this.validateAndConvertField(field, result)
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
    Object.keys(objectToReturn).forEach(field => {
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
      if (validateResult.error) {
        throw validateResult.error
      }
      return validateResult.value
    }
    return fieldValue
  }

  static getRedisKey(hashKey) {
    return `${this.name}_${hashKey}`
  }
}

export default RedisModel

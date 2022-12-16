import Redis from 'ioredis'
import Model from './Model'
import {
  DatabaseConditionalCheckFailedException,
  DatabaseItemDoesNotExistException,
  FieldDoesNotExistException,
  UnauthorizedQueryException,
} from '../../utils/exceptions'
import types from '../fieldTypes'

class RedisModel extends Model {
  static getClient() {
    console.log('Upstash host:', process.env.UPSTASH_HOST)
    console.log('Upstash password set?', !!process.env.UPSTASH_PASSWORD)
    return new Redis(
      `rediss://:${process.env.UPSTASH_PASSWORD}@${process.env.UPSTASH_HOST}`,
      {
        maxRetriesPerRequest: 3,
      }
    )
  }

  static async getInternal(key) {
    const redisClient = this.getClient()
    const redisKey = this.getRedisKey(key)
    const item = await redisClient.hgetall(redisKey)
    if (Object.keys(item).length === 0) {
      throw new DatabaseItemDoesNotExistException()
    }
    await redisClient.quit()
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
      if (Object.keys(existingEntry).length !== 0) {
        throw new DatabaseConditionalCheckFailedException()
      }
    }

    await Promise.all(
      Object.entries(item).map(([key, value]) =>
        redisClient.hset(redisKey, key, value)
      )
    )

    const object = await redisClient.hgetall(redisKey)
    await redisClient.quit()
    return this.postProcessObject(object)
  }

  static async updateInternal(item) {
    const redisClient = this.getClient()
    const redisKey = this.getRedisKey(item[this.hashKey])
    const existingEntry = await redisClient.hgetall(redisKey)
    if (Object.keys(existingEntry).length === 0) {
      throw new DatabaseItemDoesNotExistException()
    }

    await Promise.all(
      Object.entries(item).map(([key, value]) =>
        redisClient.hset(redisKey, key, value)
      )
    )

    const object = await redisClient.hgetall(redisKey)
    await redisClient.quit()
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

    await redisClient.hset(redisKey, field, value)
    await redisClient.quit()
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
    await redisClient.quit()
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

    await redisClient.quit()
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

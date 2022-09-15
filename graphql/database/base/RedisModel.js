import Redis from 'ioredis'
import { isObject } from 'lodash/lang'
import { get } from 'lodash/object'
import Model from './Model'
import {
  DatabaseConditionalCheckFailedException,
  DatabaseItemDoesNotExistException,
  FieldDoesNotExistException,
  UnauthorizedQueryException,
} from '../../utils/exceptions'
import logger from '../../utils/logger'

const client = new Redis(process.env.UPSTASH_HOST)

class RedisModel extends Model {
  static async getInternal(keys) {
    // RedisModel only understands the concept of hash keys;
    // get should not be called with a range key.
    if (keys.length > 1) {
      logger.warn(
        `RedisModel get should only be called with a hashKey, received ${keys.toString()}`
      )
    }
    const key = this.getRedisKey(keys[0])
    const item = await client.hgetall(key)
    if (Object.keys(item).length === 0) {
      throw new DatabaseItemDoesNotExistException()
    }
    return this.wrapItem(item)
  }

  static async getBatchInternal(keys) {
    keys.forEach(key => {
      if (isObject(key)) {
        throw new Error(
          `RedisModel getBatch only receives a list of hash keys, received ${keys.toString()}`
        )
      }
    })
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
    return this.wrapItem(client.hgetall(redisKey))
  }

  static async updateInternal(item) {
    const self = this
    const redisKey = this.getRedisKey(get(item, self.hashKey))
    const existingEntry = await client.hgetall(redisKey)
    if (Object.keys(existingEntry).length === 0) {
      throw new DatabaseConditionalCheckFailedException()
    }

    Object.entries(item).forEach(([key, value]) => {
      client.hset(redisKey, key, value)
    })

    return this.wrapItem(client.hgetall(redisKey))
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
    return client.hget(redisKey, field)
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

    return result
  }

  static async wrapItem(dataPromise) {
    return {
      attrs: await dataPromise,
    }
  }

  static getRedisKey(hashKey) {
    return `${this.name}_${hashKey}`
  }
}

export default RedisModel

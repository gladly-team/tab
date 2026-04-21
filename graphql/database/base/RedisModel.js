import Model from './Model'
import {
  DatabaseItemDoesNotExistException,
  FieldDoesNotExistException,
  UnauthorizedQueryException,
} from '../../utils/exceptions'

// Upstash/Redis-backed models are disabled.
//
// Every method below is a no-op so that (a) no new keys are written to Upstash
// and (b) callers that still try to read from a RedisModel get a
// "not found" response they already know how to handle
// (DatabaseItemDoesNotExistException is caught by the Group Impact helpers and
// by Model.getOrNull, which returns null).
//
// Leaving the models and their subclasses in place means the feature can be
// re-enabled later by restoring the real Upstash-backed implementation of this
// file (see git history).
class RedisModel extends Model {
  // Intentionally unused; no real client is instantiated while Upstash is
  // disabled. Kept so legacy callers referencing this symbol don't break.
  static getClient() {
    return null
  }

  // Read: always report "not found" so callers' existing not-found handling
  // (try/catch on DatabaseItemDoesNotExistException, or Model.getOrNull)
  // kicks in and the caller degrades to null / default data.
  static async getInternal() {
    throw new DatabaseItemDoesNotExistException()
  }

  // Batched read: same semantics as getInternal for every requested key.
  static async getBatchInternal(keys) {
    const items = keys.map(() => this.getInternal())
    return Promise.all(items)
  }

  // Write: silently accept the item without persisting it. Returned value
  // mirrors what callers expect (wrapped via postProcessObject) so downstream
  // code that reads fields off the result does not crash.
  static async createInternal(item) {
    return this.postProcessObject(item)
  }

  // Write: silently accept the update. See createInternal for why we return
  // a postProcessObject-wrapped value.
  static async updateInternal(item) {
    return this.postProcessObject(item)
  }

  // Write (single field): preserve authz + schema checks so any callers that
  // rely on those exceptions still see consistent behavior, but do not
  // persist anything.
  static async updateField(userContext, id, field, value) {
    if (!this.isQueryAuthorized(userContext, 'update', id)) {
      throw new UnauthorizedQueryException()
    }
    if (this.schema[field] === undefined) {
      throw new FieldDoesNotExistException()
    }
    return this.validateAndConvertField(field, value)
  }

  // Write (integer increment): preserve authz + schema checks for
  // consistency; no persistence.
  static async updateIntegerFieldBy(userContext, id, field) {
    if (!this.isQueryAuthorized(userContext, 'update', id)) {
      throw new UnauthorizedQueryException()
    }
    if (this.schema[field] === undefined) {
      throw new FieldDoesNotExistException()
    }
    return 0
  }

  // Read (single field): report "not found" so callers fall back to their
  // missing-field handling.
  static async getField(userContext, id, field) {
    if (!this.isQueryAuthorized(userContext, 'get', id)) {
      throw new UnauthorizedQueryException()
    }
    if (this.schema[field] === undefined) {
      throw new FieldDoesNotExistException()
    }
    throw new DatabaseItemDoesNotExistException()
  }

  // Delete: no-op. With nothing written to Upstash there is nothing to delete.
  static async delete() {
    // no-op
  }

  // Wraps the object in the expected { attrs } shape so callers reading the
  // return value of create/update/get keep working.
  static async postProcessObject(dataPromise) {
    const rawObject = (await dataPromise) || {}
    return {
      attrs: this.validateAndConvertObject(rawObject),
    }
  }

  // Validates each field on an object. Also casts values to their declared
  // schema types.
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

  // Validates/casts a single field value against its schema.
  static validateAndConvertField(field, fieldValue) {
    if (this.schema[field]) {
      const validateResult = this.schema[field].validate(fieldValue, {
        convert: true,
      })
      return validateResult.value
    }
    return fieldValue
  }

  // Kept for test utilities that still reference the Upstash key format
  // (e.g., cleanup helpers that call client.del(getRedisKey(...))). They will
  // no longer be used against real Upstash but we keep the shape stable.
  static getRedisKey(hashKey) {
    return `${this.name}_${hashKey}`
  }
}

export default RedisModel


import dynogels from 'dynogels'
import config from '../../config'

dynogels.AWS.config.update({
  region: config.AWS_REGION,
  endpoint: config.DYNAMODB_ENDPOINT
})

class BaseModel {
  constructor (id) {
    this.dynogelsModel = null
  }

  static register () {
    console.log(`Registering model ${this.name} to table ${this.tableName}.`)
    this.dynogelsModel = dynogels.define(this.name, {
      hashKey: this.hashKey,
      tableName: this.tableName,

      // Add two timestamps, `created` and `updated`, to
      // the item's fields.
      timestamps: true,
      createdAt: 'created',
      updatedAt: 'updated',

      schema: this.schema
    })
  }

  // TODO: support rangeKey
  static get (hashKey, rangeKey, options) {
    console.log(`Getting obj with hashKey ${hashKey} from table ${this.tableName}.`)
    const self = this
    return new Promise((resolve, reject) => {
      this.dynogelsModel.get(hashKey, (err, obj) => {
        if (err) {
          console.log(err)
          reject(err)
        } else {
          resolve(self.deserialize(obj))
        }
      })
    })
  }

  static getAll () {
    console.log(`Getting all objs in table ${this.tableName}.`)
    const self = this
    return new Promise((resolve, reject) => {
      this.dynogelsModel.scan().exec((err, objs) => {
        if (err) {
          console.log(err)
          reject(err)
        } else {
          resolve(self.deserialize(objs.Items))
        }
      })
    })
  }

  // FIXME: need to resolve to instance of child class
  /**
   * Return a modified object or list of object from the
   * database item or items.
   * @param {Object || Object[]} The database object or list of objects.
   * @return {Object | Object[]}
  */
  static deserialize (obj) {
    // TODO: use default values for missing fields
    const deserializeObj = (obj) => {
      const deserializedObj = {}
      for (var attr in obj.attrs) {
        deserializedObj[attr] = obj.attrs[attr]
      }
      return deserializedObj
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

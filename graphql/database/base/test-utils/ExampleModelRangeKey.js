
import types from '../../fieldTypes'
import BaseModel from '../BaseModel'

class ExampleModelRangeKey extends BaseModel {
  static get name () {
    return 'ExampleRangeKey'
  }

  static get hashKey () {
    return 'id'
  }

  static get rangeKey () {
    return 'age'
  }

  static get tableName () {
    return 'ExamplesRangeKeyTable'
  }

  static get schema () {
    return {
      id: types.uuid(),
      age: types.number().integer(),
      name: types.string()
    }
  }

  static get permissions () {
    return {
      get: (user, hashKeyValue, rangeKeyValue) => false,
      getAll: () => false,
      update: (user, hashKeyValue, rangeKeyValue) => false,
      create: (user, hashKeyValue) => false
    }
  }
}

ExampleModelRangeKey.register()

export const fixturesRangeKeyA = [
  {
    id: 'ab5082cc-151a-4a9a-9289-06906670fd4e',
    age: 34,
    name: 'Thing A'
  },
  {
    id: 'bb5082cc-151a-4a9a-9289-06906670fd4e',
    age: 62,
    name: 'Thing B'
  },
  {
    id: 'cb5082cc-151a-4a9a-9289-06906670fd4e',
    age: 22,
    name: 'Thing C'
  }
]

export default ExampleModelRangeKey

import types from '../../fieldTypes'
import Model from '../Model'

class ExampleModelV2RangeKey extends Model {
  static get name() {
    return 'ExampleRangeKey'
  }

  static get hashKey() {
    return 'id'
  }

  static get rangeKey() {
    return 'age'
  }

  static get tableName() {
    return 'ExamplesRangeKeyTable'
  }

  static get schema() {
    return {
      id: types.uuid(),
      age: types.number().integer(),
      name: types.string(),
    }
  }

  static get permissions() {
    return {
      get: () => false,
      getAll: () => false,
      update: () => false,
      create: () => false,
    }
  }
}

export const fixturesRangeKeyA = [
  {
    id: 'ab5082cc-151a-4a9a-9289-06906670fd4e',
    age: 34,
    name: 'Thing A',
    created: '2017-08-01T01:30:51.644Z',
    updated: '2017-08-09T17:20:41.293Z',
  },
  {
    id: 'bb5082cc-151a-4a9a-9289-06906670fd4e',
    age: 62,
    name: 'Thing B',
    created: '2017-08-02T01:30:51.644Z',
    updated: '2017-08-07T17:20:41.293Z',
  },
  {
    id: 'cb5082cc-151a-4a9a-9289-06906670fd4e',
    age: 22,
    name: 'Thing C',
    created: '2017-08-03T01:30:51.644Z',
    updated: '2017-08-05T17:20:41.293Z',
  },
]

export default ExampleModelV2RangeKey

import types from '../../fieldTypes'
import DynamoDBModel from '../DynamoDBModel'

class ExampleDynamoDBModel extends DynamoDBModel {
  static get name() {
    return 'Example'
  }

  static get hashKey() {
    return 'id'
  }

  static get rangeKey() {
    return 'range'
  }

  static get tableName() {
    return 'ExamplesTable'
  }

  static get schema() {
    const self = this
    return {
      id: types.uuid(),
      range: types.string(),
      name: types.string().default(self.fieldDefaults.name),
      thing: types.string().forbidden(),
    }
  }

  static get fieldDefaults() {
    return {
      name: 'Default Name',
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

ExampleDynamoDBModel.register()

export const fixturesA = [
  {
    id: 'ab5082cc-151a-4a9a-9289-06906670fd4e',
    name: 'Thing A',
    created: '2017-08-01T01:30:51.644Z',
    updated: '2017-08-09T17:20:41.293Z',
  },
  {
    id: 'bb5082cc-151a-4a9a-9289-06906670fd4e',
    name: 'Thing B',
    created: '2017-08-02T01:30:51.644Z',
    updated: '2017-08-07T17:20:41.293Z',
  },
  {
    id: 'cb5082cc-151a-4a9a-9289-06906670fd4e',
    name: 'Thing C',
    created: '2017-08-03T01:30:51.644Z',
    updated: '2017-08-05T17:20:41.293Z',
  },
]

export default ExampleDynamoDBModel

import types from '../../fieldTypes'
import BaseModel from '../BaseModel'

class ExampleModel extends BaseModel {
  static get name() {
    return 'Example'
  }

  static get hashKey() {
    return 'id'
  }

  static get tableName() {
    return 'ExamplesTable'
  }

  static get schema() {
    const self = this
    return {
      id: types.uuid(),
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
      get: (user, hashKeyValue, rangeKeyValue) => false,
      getAll: () => false,
      update: (user, hashKeyValue, rangeKeyValue) => false,
      create: (user, hashKeyValue) => false,
    }
  }
}

ExampleModel.register()

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

export default ExampleModel

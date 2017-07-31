
import types from '../../fieldTypes'
import BaseModel from '../BaseModel'

class ExampleModel extends BaseModel {
  static get name () {
    return 'Example'
  }

  static get hashKey () {
    return 'id'
  }

  static get tableName () {
    return 'ExamplesTable'
  }

  static get schema () {
    return {
      id: types.uuid(),
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

ExampleModel.register()

export const fixturesA = [
  {
    id: 'ab5082cc-151a-4a9a-9289-06906670fd4e',
    name: 'Thing A'
  },
  {
    id: 'bb5082cc-151a-4a9a-9289-06906670fd4e',
    name: 'Thing B'
  },
  {
    id: 'cb5082cc-151a-4a9a-9289-06906670fd4e',
    name: 'Thing C'
  }
]

export default ExampleModel


import dynogels from 'dynogels'
import Joi from 'joi'

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
      id: dynogels.types.uuid(),
      name: Joi.string()
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

/* eslint-env jest */

import ExampleModel, { fixturesA } from '../test-utils/ExampleModel'
import {
  setModelGetterField
} from '../../test-utils'

jest.mock('../../databaseClient')

describe('BaseModel deserialization', () => {
  it('deserializes to the correct instance type', () => {
    const item = {
      attrs: fixturesA[0]
    }
    const deserializedItem = ExampleModel.deserialize(item)
    expect(deserializedItem instanceof ExampleModel).toBe(true)
  })

  it('deserializes correctly', () => {
    const item = {
      attrs: {
        id: 'yy5082cc-151a-4a9a-9289-06906670fd4e',
        name: 'Jim Bond'
      }
    }
    const deserializedItem = ExampleModel.deserialize(item)
    expect(deserializedItem.id).toBe('yy5082cc-151a-4a9a-9289-06906670fd4e')
    expect(deserializedItem.name).toBe('Jim Bond')
  })

  it('deserializes to include default values', () => {
    const item = {
      attrs: {
        id: 'zb5082cc-151a-4a9a-9289-06906670fd4e'
      }
    }
    const deserializedItem = ExampleModel.deserialize(item)
    expect(deserializedItem.id).toBe('zb5082cc-151a-4a9a-9289-06906670fd4e')
    expect(deserializedItem.name).toBe(ExampleModel.fieldDefaults.name)
  })

  it('uses custom deserializers when they exist', () => {
    setModelGetterField(ExampleModel, 'fieldDeserializers', {
      name: (val) => `My name is ${val}`
    })
    const item = {
      attrs: {
        id: 'zb5082cc-151a-4a9a-9289-06906670fd4e',
        name: 'Sherlock Holmes'
      }
    }
    const deserializedItem = ExampleModel.deserialize(item)

    // Reset field for other tests.
    setModelGetterField(ExampleModel, 'fieldDeserializers', {})

    expect(deserializedItem.id).toBe('zb5082cc-151a-4a9a-9289-06906670fd4e')
    expect(deserializedItem.name).toBe('My name is Sherlock Holmes')
  })
})

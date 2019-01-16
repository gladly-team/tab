/* eslint-env jest */

import ExampleModel, { fixturesA } from '../test-utils/ExampleModel'
import { setModelGetterField } from '../../test-utils'

jest.mock('../../databaseClient')

describe('BaseModel deserialization', () => {
  it('deserializes to the correct instance type', () => {
    const item = {
      attrs: fixturesA[0],
    }
    const deserializedItem = ExampleModel.deserialize(item)
    expect(deserializedItem instanceof ExampleModel).toBe(true)
  })

  it('deserializes correctly', () => {
    const item = {
      attrs: {
        id: 'yy5082cc-151a-4a9a-9289-06906670fd4e',
        name: 'Jim Bond',
      },
    }
    const deserializedItem = ExampleModel.deserialize(item)
    expect(deserializedItem.id).toBe('yy5082cc-151a-4a9a-9289-06906670fd4e')
    expect(deserializedItem.name).toBe('Jim Bond')
    expect(deserializedItem.thing).toBeUndefined()
  })

  it('deserializes to include default values', () => {
    const item = {
      attrs: {
        id: 'zb5082cc-151a-4a9a-9289-06906670fd4e',
      },
    }
    const deserializedItem = ExampleModel.deserialize(item)
    expect(deserializedItem.id).toBe('zb5082cc-151a-4a9a-9289-06906670fd4e')
    expect(deserializedItem.name).toBe(ExampleModel.fieldDefaults.name)
  })

  it('uses custom deserializers when they exist', () => {
    setModelGetterField(ExampleModel, 'fieldDeserializers', {
      name: (val, obj) => `My name is ${val} with ID ${obj.id}`,
    })
    const item = {
      attrs: {
        id: 'zb5082cc-151a-4a9a-9289-06906670fd4e',
        name: 'Sherlock Holmes',
      },
    }
    const deserializedItem = ExampleModel.deserialize(item)

    // Reset field for other tests.
    setModelGetterField(ExampleModel, 'fieldDeserializers', {})

    expect(deserializedItem.id).toBe('zb5082cc-151a-4a9a-9289-06906670fd4e')
    expect(deserializedItem.name).toBe(
      'My name is Sherlock Holmes with ID zb5082cc-151a-4a9a-9289-06906670fd4e'
    )
  })

  it('passes a field default to the custom serializer if the field does not exist', () => {
    setModelGetterField(ExampleModel, 'fieldDeserializers', {
      name: val => `My name is ${val}`,
    })
    const item = {
      attrs: {
        id: 'zb5082cc-151a-4a9a-9289-06906670fd4e',
      },
    }
    const deserializedItem = ExampleModel.deserialize(item)

    // Reset field for other tests.
    setModelGetterField(ExampleModel, 'fieldDeserializers', {})

    expect(deserializedItem.id).toBe('zb5082cc-151a-4a9a-9289-06906670fd4e')
    expect(deserializedItem.name).toBe('My name is Default Name')
  })

  it('does not set the property if a custom deserializer returns null', () => {
    setModelGetterField(ExampleModel, 'fieldDeserializers', {
      name: () => null,
    })
    const item = {
      attrs: {
        id: 'zb5082cc-151a-4a9a-9289-06906670fd4e',
        name: 'Jon Snow',
      },
    }
    const deserializedItem = ExampleModel.deserialize(item)

    // Reset field for other tests.
    setModelGetterField(ExampleModel, 'fieldDeserializers', {})

    expect(deserializedItem.id).toBe('zb5082cc-151a-4a9a-9289-06906670fd4e')
    expect(deserializedItem.name).toBeUndefined()
  })

  it('calls custom serializers even if the field is not defined', () => {
    setModelGetterField(ExampleModel, 'fieldDeserializers', {
      thing: () => 'boop!',
    })
    const item = {
      attrs: {
        id: 'zb5082cc-151a-4a9a-9289-06906670fd4e',
        name: 'Dr. Who',
      },
    }
    const deserializedItem = ExampleModel.deserialize(item)

    // Reset field for other tests.
    setModelGetterField(ExampleModel, 'fieldDeserializers', {})

    expect(deserializedItem.id).toBe('zb5082cc-151a-4a9a-9289-06906670fd4e')
    expect(deserializedItem.thing).toBe('boop!')
  })
})

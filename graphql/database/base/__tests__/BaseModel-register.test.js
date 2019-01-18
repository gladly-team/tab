/* eslint-env jest */

import dynogels from '../dynogels-promisified'
import types from '../../fieldTypes'
import { setModelGetterField } from '../../test-utils'

jest.mock('../dynogels-promisified')
jest.mock('../../databaseClient')

// Add additional fields to the schema.
function constructSchema(schema) {
  return Object.assign(schema, {
    created: types.string().isoDate(),
    updated: types.string().isoDate(),
  })
}

describe('BaseModel registering with Dynogels', () => {
  afterEach(() => {
    // Note: jest.resetModules does not work with ExampleModel
    // (problem is unclear), so it it not reset between tests.
    jest.resetAllMocks()
  })

  it('works with hash key and no range key', () => {
    const TestModel = require('../test-utils/ExampleModel').default
    setModelGetterField(TestModel, 'hashKey', 'id')
    setModelGetterField(TestModel, 'rangeKey', null)
    const schema = {}
    setModelGetterField(TestModel, 'schema', schema)
    TestModel.register()
    expect(dynogels.define).toHaveBeenLastCalledWith(TestModel.name, {
      hashKey: 'id',
      tableName: TestModel.tableName,
      timestamps: false,
      schema: constructSchema(schema),
      validation: {
        convert: false,
      },
    })
  })

  it('works with both hash key and range key', () => {
    const TestModel = require('../test-utils/ExampleModel').default
    setModelGetterField(TestModel, 'hashKey', 'id')
    setModelGetterField(TestModel, 'rangeKey', 'someOtherField')
    const schema = {}
    setModelGetterField(TestModel, 'schema', schema)
    TestModel.register()
    expect(dynogels.define).toHaveBeenLastCalledWith(TestModel.name, {
      hashKey: 'id',
      rangeKey: 'someOtherField',
      tableName: TestModel.tableName,
      timestamps: false,
      schema: constructSchema(schema),
      validation: {
        convert: false,
      },
    })
  })

  it('uses the correct schema', () => {
    const TestModel = require('../test-utils/ExampleModel').default
    setModelGetterField(TestModel, 'hashKey', 'id')
    setModelGetterField(TestModel, 'rangeKey', null)
    const schema = {
      foo: 'bar',
      baz: {
        a: 12,
        z: 'abc',
      },
    }
    const expectedSchema = constructSchema(schema)
    setModelGetterField(TestModel, 'schema', schema)
    TestModel.register()
    expect(dynogels.define).toHaveBeenLastCalledWith(TestModel.name, {
      hashKey: 'id',
      tableName: TestModel.tableName,
      timestamps: false,
      schema: expectedSchema,
      validation: {
        convert: false,
      },
    })
  })

  it('works with indexes', () => {
    const TestModel = require('../test-utils/ExampleModel').default
    setModelGetterField(TestModel, 'hashKey', 'id')
    setModelGetterField(TestModel, 'rangeKey', null)
    const schema = {}
    setModelGetterField(TestModel, 'schema', schema)
    const indexes = [
      {
        hashKey: 'myIndexHashKey',
        name: 'MyIndex',
        type: 'global',
      },
    ]
    setModelGetterField(TestModel, 'indexes', indexes)
    TestModel.register()
    expect(dynogels.define).toHaveBeenLastCalledWith(TestModel.name, {
      hashKey: 'id',
      tableName: TestModel.tableName,
      indexes,
      timestamps: false,
      schema: constructSchema(schema),
      validation: {
        convert: false,
      },
    })
  })
})

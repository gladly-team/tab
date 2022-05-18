/* eslint-env jest */

jest.mock('../../databaseClient')

describe('BaseModel required properties', () => {
  afterEach(() => {
    jest.resetModules()
  })

  it('fails if "name" property is not set', () => {
    const TestModel = require('../test-utils/ExampleModelV2').default
    delete TestModel.name
    expect(() => {
      TestModel.register()
    }).toThrow('Model is missing a required field (schema, hashKey or name)')
  })

  it('fails if "hashKey" property is not set', () => {
    const TestModel = require('../test-utils/ExampleModelV2').default
    delete TestModel.hashKey
    expect(() => {
      TestModel.register()
    }).toThrow('Model is missing a required field (schema, hashKey or name)')
  })

  it('fails if "schema" property is not set', () => {
    const TestModel = require('../test-utils/ExampleModelV2').default
    delete TestModel.schema
    expect(() => {
      TestModel.register()
    }).toThrow('Model is missing a required field (schema, hashKey or name)')
  })

  it('fails if "schema" property is not set', () => {
    const TestModel = require('../test-utils/ExampleModelV2').default
    delete TestModel.schema
    expect(() => {
      TestModel.register()
    }).toThrow('Model is missing a required field (schema, hashKey or name)')
  })

  it('succeeds normally', () => {
    const TestModel = require('../test-utils/ExampleModelV2').default
    expect(() => {
      TestModel.register()
    }).not.toThrow(
      'Model is missing a required field (schema, hashKey or name)'
    )
  })
})

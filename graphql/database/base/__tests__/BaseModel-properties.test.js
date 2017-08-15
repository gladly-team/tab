/* eslint-env jest */

jest.mock('../../databaseClient')

describe('BaseModel required properties', () => {
  afterEach(() => {
    jest.resetModules()
  })

  it('fails if "name" property is not set', () => {
    const TestModel = require('../test-utils/ExampleModel').default
    delete TestModel.name
    expect(() => {
      TestModel.register()
    }).toThrow()
  })

  it('fails if "hashKey" property is not set', () => {
    const TestModel = require('../test-utils/ExampleModel').default
    delete TestModel.hashKey
    expect(() => {
      TestModel.register()
    }).toThrow()
  })

  it('fails if "tableName" property is not set', () => {
    const TestModel = require('../test-utils/ExampleModel').default
    delete TestModel.tableName
    expect(() => {
      TestModel.register()
    }).toThrow()
  })

  it('fails if "schema" property is not set', () => {
    const TestModel = require('../test-utils/ExampleModel').default
    delete TestModel.schema
    expect(() => {
      TestModel.register()
    }).toThrow()
  })

  it('succeeds normally', () => {
    const TestModel = require('../test-utils/ExampleModel').default
    expect(() => {
      TestModel.register()
    }).not.toThrow()
  })
})

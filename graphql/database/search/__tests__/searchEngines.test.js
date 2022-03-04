/* eslint-env jest */

jest.mock('../searchEngineData', () => {
  const module = {
    // Can spy on getters:
    // https://jestjs.io/docs/jest-object#jestspyonobject-methodname-accesstype
    __esModule: true,
    get default() {
      return jest.requireActual('../searchEngineData').default
    },
  }
  return module
})

afterEach(() => {
  jest.resetAllMocks()
  jest.resetModules()
})

describe('searchEngines', () => {
  it('returns an array', () => {
    const searchEngines = require('../searchEngines').default
    expect(searchEngines).toBeInstanceOf(Array)
  })

  it('returns an item with the expected SearchEngine shape', () => {
    const searchEngines = require('../searchEngines').default
    const searchEngineSubset = {
      id: expect.any(String),
      name: expect.any(String),
      searchUrl: expect.any(String),
      rank: expect.any(Number),
      isCharitable: expect.any(Boolean),
      inputPrompt: expect.any(String),
    }
    expect(searchEngines[0]).toMatchObject(
      expect.objectContaining(searchEngineSubset)
    )
  })

  it('throws if provided data fails SearchEngineModel schema validation', () => {
    const dataModule = require('../searchEngineData')
    jest.spyOn(dataModule, 'default', 'get').mockImplementation(() => {
      const realData = jest.requireActual('../searchEngineData').default
      delete realData[0].name
      return realData
    })
    expect(() => require('../searchEngines').default).toThrow(
      'child "name" fails because ["name" is required]'
    )
  })
})

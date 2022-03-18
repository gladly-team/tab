/* eslint-env jest */

const MOCK_SEARCH_ENGINE_1 = {
  id: 'engine1',
}
const MOCK_SEARCH_ENGINE_2 = {
  id: 'engine2',
}

jest.mock('../searchEngines', () => [
  MOCK_SEARCH_ENGINE_1,
  MOCK_SEARCH_ENGINE_2,
])

afterEach(() => {
  jest.resetModules()
})

describe('getSearchEngine', () => {
  it('returns the expected search engine', () => {
    const getSearchEngine = require('../getSearchEngine').default
    expect(getSearchEngine('engine1')).toEqual(MOCK_SEARCH_ENGINE_1)
    expect(getSearchEngine('engine2')).toEqual(MOCK_SEARCH_ENGINE_2)
  })

  it('throws if the search engine does not exist', () => {
    const getSearchEngine = require('../getSearchEngine').default
    expect(() => getSearchEngine('blahblah')).toThrow()
  })
})

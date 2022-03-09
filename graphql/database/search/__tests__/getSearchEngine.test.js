/* eslint-env jest */

const MOCK_SEARCH_ENGINE_1 = {
  id: 'engine1',
}
const MOCK_SEARCH_ENGINE_2 = {
  id: 'engine2',
}

jest.mock('../searchEngines', () => {
  return [MOCK_SEARCH_ENGINE_1, MOCK_SEARCH_ENGINE_2]
})

afterEach(() => {
  jest.resetModules()
})

describe('getSearchEngine', () => {
  it('returns the expected search engine', async () => {
    expect.assertions(2)
    const getSearchEngine = require('../getSearchEngine').default
    expect(await getSearchEngine('engine1')).toEqual(MOCK_SEARCH_ENGINE_1)
    expect(await getSearchEngine('engine2')).toEqual(MOCK_SEARCH_ENGINE_2)
  })

  it('throws if the search engine does not exist', async () => {
    expect.assertions(1)
    const getSearchEngine = require('../getSearchEngine').default
    await expect(getSearchEngine('blahblah')).rejects.toThrow(
      'The database does not contain an item with these keys.'
    )
  })
})

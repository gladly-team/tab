/* eslint-env jest */

import SearchEngine from '../SearchEngineModel'
import { mockDate } from '../../test-utils'

jest.mock('../../databaseClient')

beforeAll(() => {
  mockDate.on()
})

afterAll(() => {
  mockDate.off()
})

describe('SearchEngineModel', () => {
  it('implements the name property', () => {
    expect(SearchEngine.name).toBeDefined()
  })

  it('implements the hashKey property', () => {
    expect(SearchEngine.hashKey).toBeDefined()
  })

  it('implements the tableName property', () => {
    expect(SearchEngine.tableName).toBe('UNUSED_SearchEngines')
  })

  it('constructs as expected', () => {
    const item = Object.assign(
      {},
      new SearchEngine({
        name: 'Search For A Cause',
        id: 'SearchForACause',
        searchUrl: 'http://tab.gladly.io/search/v2?q=',
        rank: 0,
        isCharitable: true,
        inputPrompt: 'Search For a Cause',
      })
    )
    expect(item).toEqual({
      name: 'Search For A Cause',
      id: 'SearchForACause',
      searchUrl: 'http://tab.gladly.io/search/v2?q=',
      rank: 0,
      isCharitable: true,
      inputPrompt: 'Search For a Cause',
    })
  })
})

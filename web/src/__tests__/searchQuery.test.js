/* eslint-env jest */

jest.mock('js/components/Search/fetchBingSearchResults')

beforeAll(() => {
  process.env.REACT_APP_WHICH_APP = 'search'
})

afterEach(() => {
  jest.clearAllMocks()
  jest.resetModules()
})

afterAll(() => {
  delete process.env.REACT_APP_WHICH_APP
})

describe('searchQuery entry point', () => {
  it('calls prefetchSearchResults on load', () => {
    const {
      prefetchSearchResults,
    } = require('js/components/Search/fetchBingSearchResults')
    require('searchQuery')
    expect(prefetchSearchResults).toHaveBeenCalled()
  })

  it('does not call prefetchSearchResults when REACT_APP_WHICH_APP == "newtab"', () => {
    process.env.REACT_APP_WHICH_APP = 'newtab'
    const {
      prefetchSearchResults,
    } = require('js/components/Search/fetchBingSearchResults')
    require('searchQuery')
    expect(prefetchSearchResults).not.toHaveBeenCalled()
  })

  it('does not call prefetchSearchResults when REACT_APP_WHICH_APP is undefined', () => {
    delete process.env.REACT_APP_WHICH_APP
    const {
      prefetchSearchResults,
    } = require('js/components/Search/fetchBingSearchResults')
    require('searchQuery')
    expect(prefetchSearchResults).not.toHaveBeenCalled()
  })
})

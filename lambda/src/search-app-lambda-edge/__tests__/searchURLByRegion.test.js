afterEach(() => {
  jest.clearAllMocks()
})

const US_SEARCH_URL = 'https://search.yahoo.com'
const urlPath = '/yhs/search?hspart=gladly&hsimp=yhs-001'

describe('searchURLByRegion', () => {
  it('returns the US base URL when no arguments are provided', () => {
    expect.assertions(1)
    const searchURLByRegion = require('../searchURLByRegion').default
    expect(searchURLByRegion()).toEqual(US_SEARCH_URL + urlPath)
  })
})

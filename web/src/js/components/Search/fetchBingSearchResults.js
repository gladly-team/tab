import qs from 'qs'
import getMockBingSearchResults from 'js/components/Search/getMockBingSearchResults'
import { getSearchResultCountPerPage } from 'js/utils/search-utils'
import { getBingClientID } from 'js/utils/local-user-data-mgr'

/**
 * Call our search API endpoint.
 * @param {String} query - The search query, unencoded.
 * @param {Object} options - Additional search parameters to send.
 * @return {Object}
 */
const fetchBingSearchResults = async (query = null, { offset } = {}) => {
  if (!query) {
    throw new Error(`Search query must be a non-empty string.`)
  }
  if (
    process.env.NODE_ENV === 'development' &&
    process.env.REACT_APP_MOCK_SEARCH_RESULTS === 'true'
  ) {
    // Mock search results, including network delay.
    return new Promise(resolve => {
      setTimeout(() => resolve(getMockBingSearchResults()), 400)
    })
  }
  try {
    const endpoint = process.env.REACT_APP_SEARCH_QUERY_ENDPOINT
    if (!endpoint) {
      throw new Error('Search query endpoint is not defined.')
    }

    const bingClientID = getBingClientID()
    const searchURL = `${endpoint}?${qs.stringify({
      q: query,
      count: getSearchResultCountPerPage(),
      ...(bingClientID && { bingClientID }),
      ...(offset && { offset }),
    })}&${qs.stringify(
      {
        // Possible values:
        // Computation, Entities, Images, News, RelatedSearches, SpellSuggestions,
        // TimeZone, Videos, Webpages
        // Makes sure commas for list items are not encoded.
        // Bing makes this mandatory.
        responseFilter: 'Webpages,News',
      },
      { arrayFormat: 'comma', encode: false }
    )}`

    return fetch(searchURL, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        return response
          .json()
          .then(response => response)
          .catch(e => {
            throw e
          })
      })
      .catch(e => {
        throw e
      })
  } catch (e) {
    throw e
  }
}

export default fetchBingSearchResults

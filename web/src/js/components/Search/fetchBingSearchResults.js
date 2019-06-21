import qs from 'qs'
import getMockBingSearchResults from 'js/components/Search/getMockBingSearchResults'
import { getSearchResultCountPerPage } from 'js/utils/search-utils'
import { getBingClientID } from 'js/utils/local-user-data-mgr'
import getBingMarketCode from 'js/components/Search/getBingMarketCode'

/**
 * Call our search API endpoint.
 * @param {String} query - The search query, unencoded.
 * @param {Object} options - Additional search parameters to send.
 * @param {Number} options.page - The 1-based search results age number.
 * @return {Object}
 */
const fetchBingSearchResults = async (query = null, { page } = {}) => {
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
    const pageNumber = page && page > 0 ? page - 1 : 0

    // The mkt parameter is not required but highly recommended.
    const mkt = await getBingMarketCode()

    const offset = getSearchResultCountPerPage() * pageNumber

    const bingClientID = getBingClientID()
    const searchURL = `${endpoint}?${qs.stringify({
      q: query,
      count: getSearchResultCountPerPage(),
      // The maximum number of mainline ads to return.
      mainlineCount: 3,
      // The zero-based page number, used for ads.
      pageNumber: pageNumber,
      // The maximum number of sidebar ads to return.
      sidebarCount: 0,
      // A list of extensions to include with the text ads.
      // By default, ads will not include extensions. See ads
      // documentation for possible values.
      supportedAdExtensions: 'EnhancedSiteLinks,SiteLinks',
      ...(bingClientID && { bingClientID }),
      ...(mkt && { mkt }),
      ...(offset && { offset }),
    })}&${qs.stringify(
      {
        // Possible values:
        // Computation, Entities, Images, News, RelatedSearches, SpellSuggestions,
        // TimeZone, Videos, Webpages
        // Makes sure commas for list items are not encoded.
        // We should only include answer types that we will display.
        responseFilter: 'Webpages,News,Ads,Computation',
        // Possible values: TextAds (required), AppInstallAds, ProductAds
        adTypesFilter: 'TextAds',
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
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }
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

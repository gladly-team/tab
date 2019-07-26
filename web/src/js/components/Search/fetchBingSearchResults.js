import qs from 'qs'
import { get, set } from 'lodash/object'
import getMockBingSearchResults from 'js/components/Search/getMockBingSearchResults'
import {
  getSearchGlobal,
  getSearchResultCountPerPage,
} from 'js/utils/search-utils'
import { getBingClientID } from 'js/utils/local-user-data-mgr'
import getBingMarketCode from 'js/components/Search/getBingMarketCode'
import { getUrlParameters } from 'js/utils/utils'

// Note: this module should reasonably stand on its own because
// it may load prior to app code via a separate JS entry point,
// which speeds up fetching search results. We also call this
// module via app code.

const eventNameResultsFetched = 'SearchResultsFetched'
const QUERY_IN_PROGRESS = 'IN_PROGRESS'
const QUERY_COMPLETE = 'COMPLETE'

const DEBUG = true

/**
 * Make a request for search results potentially prior to our app
 * initializing, and store those results in a window variable.
 * This relies on URL parameter values for the search query, etc.
 * @return {undefined}
 */
export const prefetchSearchResults = async () => {
  if (DEBUG) {
    console.log('Prefetch: started')
  }
  // Mark that a search query is in progress.
  const searchGlobalObj = getSearchGlobal()
  set(searchGlobalObj, 'queryRequest.status', QUERY_IN_PROGRESS)

  // Fetch search results.
  let results = null
  try {
    results = await fetchBingSearchResults({
      ignoreStoredData: true,
    })
    if (DEBUG) {
      console.log('Prefetch: complete')
    }
  } catch (e) {
    console.error(e)
  }

  // Store the search response. Used to retrieve data that's
  // fetched before our app code loads.
  set(searchGlobalObj, 'queryRequest.responseData', results)

  // Dispatch an event if the app code's loaded and waiting
  // for search results.
  window.dispatchEvent(new CustomEvent(eventNameResultsFetched))

  // Mark the request as complete.
  set(searchGlobalObj, 'queryRequest.status', QUERY_COMPLETE)
}

/**
 * Return data from any previously-completed or pending search results
 * requests. The previous request may happen via another JS entry point
 * that we prioritize to speed up fetching the search results. If there
 * is no valid data, return null.
 * @return {Promise<Object|null>}
 */
const getPreviouslyFetchedData = async () => {
  if (DEBUG) {
    console.log('App fetch: getting previously-fetched data')
  }
  const searchGlobalObj = getSearchGlobal()
  const queryRequest = get(searchGlobalObj, 'queryRequest')

  // If we don't have any info in the global object, then we
  // have no previously-fetched search data.
  if (!queryRequest) {
    return null
  }

  // If we already used the search results data, don't re-use it.
  // Return null so we fetch fresh data.
  else if (queryRequest.displayedResults) {
    return null
  }

  // Else, if a search query is in progress, wait for it. Listen
  // for an event to know when it's completed.
  else if (queryRequest.status === QUERY_IN_PROGRESS) {
    if (DEBUG) {
      console.log('App fetch: waiting for in-progress request')
    }

    // Resolve when we receive search result data or we time out.
    return new Promise(resolve => {
      function queryCompleteHandler() {
        window.removeEventListener(
          eventNameResultsFetched,
          queryCompleteHandler,
          false
        )
        resolve(get(getSearchGlobal(), 'queryRequest.responseData'))
      }

      // Listen for the dispatched event when we receive results.
      window.addEventListener(
        eventNameResultsFetched,
        queryCompleteHandler,
        false
      )

      // Set a max time to wait.
      const msToWaitBeforeRetrying = 800
      setTimeout(() => {
        window.removeEventListener(
          eventNameResultsFetched,
          queryCompleteHandler,
          false
        )
        resolve(null)
      }, msToWaitBeforeRetrying)
    })
  }

  // Else, if a search query is complete, use its data.
  else if (
    queryRequest.status === QUERY_COMPLETE &&
    !!queryRequest.responseData
  ) {
    if (DEBUG) {
      console.log('App fetch: prefetched data was complete, using it')
    }
    return queryRequest.responseData
  }

  // For any other situation, return no data.
  else {
    return null
  }
}

/**
 * Call our search API endpoint. All parameters must be optional.
 * @param {Object} options
 * @param {String} options.query - The search query, unencoded.
 * @param {Number} options.page - The 1-based search results page number.
 * @param {Boolean} options.ignoreStoredData - If true, it will not use
 *   any data that we "prefetched" and stored.
 * @return {Promise<Object>}
 */
const fetchBingSearchResults = async ({
  query: providedQuery = null,
  page,
  ignoreStoredData,
} = {}) => {
  // MEASURING PERFORMANCE
  if (window && window.performance && window.debug) {
    var t = performance.now()
    // console.log('query', t)
    // console.log('provided query value', providedQuery)
    window.debug.query = t
  }

  // Return mock search results as needed in development.
  if (
    process.env.NODE_ENV === 'development' &&
    process.env.REACT_APP_MOCK_SEARCH_RESULTS === 'true'
  ) {
    // Mock search results, including network delay.
    return new Promise(resolve => {
      setTimeout(() => resolve(getMockBingSearchResults()), 400)
    })
  }

  // If no query value is provided, try to get it from the "q"
  // URL parameter.
  const urlParams = getUrlParameters()
  const query = providedQuery || urlParams.q || null

  // If the search results request is already complete or in
  // progress, use that request's data.
  if (!ignoreStoredData) {
    try {
      const priorFetchedData = await getPreviouslyFetchedData()
      if (priorFetchedData) {
        // Save that we've used this data already so that we fetch fresh
        // data the next time the user queries.
        const searchGlobalObj = getSearchGlobal()
        set(searchGlobalObj, 'queryRequest.displayedResults', true)
        return priorFetchedData
      } else {
        if (DEBUG) {
          console.log('App fetch: not using previously-fetched data')
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  if (!query) {
    throw new Error(`Search query must be a non-empty string.`)
  }
  try {
    const endpoint = process.env.REACT_APP_SEARCH_QUERY_ENDPOINT
    if (!endpoint) {
      throw new Error('Search query endpoint is not defined.')
    }

    // Determine the search results page number, using the "page"
    // query parameter if not provided.
    let pageNumber = 0
    if (page && page > 0) {
      pageNumber = page - 1
    } else {
      const paramPageNum = parseInt(urlParams.page, 10)
      if (!isNaN(paramPageNum) && paramPageNum > 0) {
        pageNumber = paramPageNum - 1
      }
    }

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
        responseFilter: 'Webpages,News,Ads,Computation,TimeZone,Videos',
        // Possible values: TextAds (required), AppInstallAds, ProductAds
        adTypesFilter: 'TextAds',
      },
      { arrayFormat: 'comma', encode: false }
    )}`

    const response = await fetch(searchURL, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }
    const responseJSON = await response.json()
    return responseJSON
  } catch (e) {
    throw e
  }
}

export default fetchBingSearchResults

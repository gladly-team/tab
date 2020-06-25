import qs from 'qs'
import { get, set } from 'lodash/object'
import getMockCodefuelSearchResults from 'js/components/Search/getMockCodefuelSearchResults'
import { getUrlParameters } from 'js/utils/utils'
import {
  getSearchGlobal,
  getSearchResultCountPerPage,
} from 'js/utils/search-utils'

const DEBUG = false
const eventNameResultsFetched = 'SearchResultsFetched'
const QUERY_IN_PROGRESS = 'IN_PROGRESS'
const QUERY_COMPLETE = 'COMPLETE'

const ITEMS = 'Items'
const PLACEMENT_MAINLINE = 'Mainline'
const PLACEMENT_SIDEBAR = 'Sidebar'

// CodeFuel's top-level keys for each result type.
const CODEFUEL_RESULT_TYPE_KEY_WEBPAGE = 'OrganicResults'
const CODEFUEL_RESULT_TYPE_KEY_VIDEO = 'VideoResults'
const CODEFUEL_RESULT_TYPE_NEWS = 'NewsResults'
const CODEFUEL_RESULT_TYPE_ADS = 'SponsoredResults'
const CODEFUEL_RESULT_TYPE_COMPUTATION = 'computation'

// Result types used internally in components.
const RESULT_TYPE_WEBPAGES = 'WebPages'
const RESULT_TYPE_VIDEOS = 'Videos'
const RESULT_TYPE_NEWS = 'News'
const RESULT_TYPE_ADS = 'Ads'
const RESULT_SUBTYPE_ADS_TEXT = 'Ads/TextAd'
const RESULT_SUBTYPE_ADS_SITE_LINK = 'Ads/SiteLinkExtension'
const RESULT_TYPE_COMPUTATION = 'Computation'

// Create a generic search result object
const createSearchResult = ({
  type,
  key,
  pixelUrl,
  placement,
  rank,
  value,
}) => {
  if (!key) {
    throw new Error(`Search result expected a "key" value.`)
  }
  if (!placement) {
    throw new Error(`Search result expected a "placement" value.`)
  }
  if (!rank && rank !== 0) {
    throw new Error(`Search result expected a "rank" value.`)
  }
  return {
    type,
    key,
    pixelUrl,
    placement,
    rank,
    value,
  }
}

// Takes an object (raw CodeFuel organic webpage data) and returns our
// internal webpage result object.
const createWebpageResult = data => {
  return createSearchResult({
    type: RESULT_TYPE_WEBPAGES,
    key: data.TargetedUrl, // assume unique
    pixelUrl: data.PixelUrl,
    placement: data.PlacementHint,
    rank: data.Rank,
    value: {
      displayUrl: data.DisplayUrl,
      deepLinks: get(data, 'DeepLinks', []).map(deepLink => ({
        name: deepLink.Title,
        url: deepLink.TargetedUrl,
        snippet: deepLink.Description,
      })),
      id: data.TargetedUrl, // assume unique
      name: data.Title,
      snippet: data.Description,
      url: data.TargetedUrl,
    },
  })
}

// Takes an object (raw CodeFuel organic computation data) and returns our
// internal computation result object.
const createComputationResult = data => {
  return createSearchResult({
    type: RESULT_TYPE_COMPUTATION,
    // Note different casing for keys in this result type.
    key: data.pixelUrl, // assume unique
    pixelUrl: data.pixelUrl,
    placement: PLACEMENT_MAINLINE,
    rank: 0, // should always be at the top
    value: {
      expression: data.expression,
      value: data.value,
    },
  })
}

// Takes an array (all videos, raw CodeFuel data) and returns our
// our video results object.
const createVideoResults = (data = []) => {
  if (!data.length) {
    return []
  }
  const firstItem = data[0]
  return createSearchResult({
    type: RESULT_TYPE_VIDEOS,
    key: firstItem.TargetedUrl,
    pixelUrl: firstItem.PixelUrl,
    placement: firstItem.PlacementHint, // all items have the same placement
    rank: firstItem.Rank, // all items have the same rank
    value: data.map(videoItem => ({
      allowHttpsEmbed: !!videoItem.AllowHttpsEmbed,
      allowMobileEmbed: !!videoItem.AllowMobileEmbed,
      // contentUrl: undefined,
      datePublished: videoItem.DatePublished,
      description: videoItem.Description,
      duration: videoItem.Duration,
      embedHtml: videoItem.EmbedHtml,
      // encodingFormat: undefined,
      // height: undefined,
      // hostPageDisplayUrl: '',
      hostPageUrl: videoItem.TargetedUrl,
      // hostPageUrlPingSuffix: undefined,
      // isAccessibleForFree: undefined,
      // isSuperfresh: undefined,
      // motionThumbnailUrl: undefined,
      name: videoItem.Title,
      publisher: [
        {
          name: videoItem.Publisher,
        },
      ],
      thumbnail: {
        width: videoItem.ThumbnailWidth,
        height: videoItem.ThumbnailHeight,
      },
      thumbnailUrl: videoItem.ThumbnailUrl,
      viewCount: videoItem.ViewCount,
      // webSearchUrl: undefined,
      // webSearchUrlPingSuffix: undefined,
      // width: undefined,
    })),
  })
}

// Takes an array (all news, raw CodeFuel data) and returns
// our news results object.
const createNewsResults = (data = []) => {
  if (!data.length) {
    return []
  }
  const firstItem = data[0]
  return createSearchResult({
    type: RESULT_TYPE_NEWS,
    key: firstItem.TargetedUrl,
    pixelUrl: firstItem.PixelUrl,
    placement: firstItem.PlacementHint, // all items have the same placement
    rank: firstItem.Rank, // all items have the same rank
    value: data.map(newsItem => ({
      // category: '',
      // clusteredArticles: [],
      // contractualRules: [
      //   {
      //     text: '',
      //   },
      // ],
      datePublished: newsItem.DatePublished,
      description: newsItem.Description,
      // headline: false,
      // id: '', // might not exist
      image: {
        thumbnail: {
          contentUrl: newsItem.ThumbnailUrl,
          height: newsItem.ThumbnailHeight,
          width: newsItem.ThumbnailWidth,
        },
      },
      // mentions: [
      //   {
      //     name: '',
      //   },
      // ],
      name: newsItem.Title,
      provider: [
        {
          // _type: '',
          name: newsItem.Provider,
          // image: {
          //   thumbnail: {
          //     contentUrl: '',
          //   },
          // },
        },
      ],
      url: newsItem.TargetedUrl,
      // video: {
      //   allowHttpsEmbed: false,
      //   embedHtml: '',
      //   motionThumbnailUrl: '',
      //   name: '',
      //   thumbnail: {
      //     height: 123,
      //     width: 123,
      //   },
      //   thumbnailUrl: '',
      // },
    })),
  })
}

// Takes an object (raw CodeFuel text addata) and returns our
// internal text ad result object.
const createTextAdResult = data => {
  return createSearchResult({
    type: RESULT_TYPE_ADS,
    key: data.TargetedUrl, // assume unique
    pixelUrl: data.PixelUrl,
    placement: data.PlacementHint,
    rank: data.Rank,
    value: {
      _type: RESULT_SUBTYPE_ADS_TEXT, // matches Bing API for ease of use with existing components
      // businessName: '',
      description: data.Description,
      displayUrl: data.DisplayUrl,
      extensions: [
        {
          _type: RESULT_SUBTYPE_ADS_SITE_LINK,
          sitelinks: get(data, 'SiteLinks', []).map(siteLink => ({
            descriptionLine1: siteLink.DescriptionLine1,
            descriptionLine2: siteLink.DescriptionLine2,
            link: siteLink.TargetedUrl,
            pixelUrl: siteLink.PixelUrl,
            text: siteLink.Text,
          })),
        },
      ],
      id: data.TargetedUrl, // assume unique
      // isAdult: false,
      // phoneNumber: '',
      // position: 'Mainline',
      // rank: 2,
      title: data.Title,
      url: data.TargetedUrl,
      // urlPingSuffix: '',
    },
  })
}

const formatSearchResults = rawSearchResults => {
  const mainlineResults = []
  const sidebarResults = []

  // Iterate through result data, formatting each result's data
  // and assigning them to the appropriate position (mainline,
  // sidebar, etc).
  // The data is restructured to match Bing's result types for
  // ease of use with existing components.
  const webpageResults = get(
    rawSearchResults,
    [CODEFUEL_RESULT_TYPE_KEY_WEBPAGE, ITEMS],
    []
  ).map(item => createWebpageResult(item))
  const videoResults = createVideoResults(
    get(rawSearchResults, [CODEFUEL_RESULT_TYPE_KEY_VIDEO, ITEMS], [])
  )
  const newsResults = createNewsResults(
    get(rawSearchResults, [CODEFUEL_RESULT_TYPE_NEWS, ITEMS], [])
  )
  const adResults = get(
    rawSearchResults,
    [CODEFUEL_RESULT_TYPE_ADS, ITEMS],
    []
  ).map(item => createTextAdResult(item))
  const computationResults = get(
    rawSearchResults,
    CODEFUEL_RESULT_TYPE_COMPUTATION
  )
    ? [
        createComputationResult(
          get(rawSearchResults, CODEFUEL_RESULT_TYPE_COMPUTATION)
        ),
      ]
    : []
  const allResults = []
    .concat(webpageResults)
    .concat(videoResults)
    .concat(newsResults)
    .concat(adResults)
    .concat(computationResults)
  allResults.forEach(item => {
    switch (item.placement) {
      case PLACEMENT_MAINLINE: {
        mainlineResults.push(item)
        break
      }
      case PLACEMENT_SIDEBAR: {
        sidebarResults.push(item)
        break
      }
      default:
        break
    }
  })
  return {
    resultsCount: get(rawSearchResults, [
      CODEFUEL_RESULT_TYPE_KEY_WEBPAGE,
      'NumResults',
    ]),
    results: {
      mainline: mainlineResults,
      sidebar: sidebarResults,
    },
  }
}

/**
 * Make a request for search results potentially prior to our app
 * initializing, and store those results in a window variable.
 * This relies on URL parameter values for the search query, etc.
 * @return {undefined}
 */
export const prefetchSearchResults = async () => {
  if (DEBUG) {
    console.log('[search-debug] Prefetch: started')
  }
  // Mark that a search query is in progress.
  const searchGlobalObj = getSearchGlobal()
  set(searchGlobalObj, 'queryRequest.status', QUERY_IN_PROGRESS)

  let query = null
  try {
    const urlParams = getUrlParameters()
    const query = urlParams.q || null
    set(searchGlobalObj, 'queryRequest.query', query)
  } catch (e) {}

  // Fetch search results.
  let results = null
  try {
    results = await fetchCodefuelSearchResults({
      query,
      ignoreStoredData: true,
    })
    if (DEBUG) {
      console.log('[search-debug] Prefetch: complete')
    }
  } catch (e) {
    // console.error(e)
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
 * @param {Object} options
 * @param {String} options.query - The search query, unencoded.
 * @return {Promise<Object|null>}
 */
const getPreviouslyFetchedData = async ({ query = null }) => {
  if (DEBUG) {
    console.log('[search-debug] App fetch: getting previously-fetched data')
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

  // If this query is different from the query in stored results,
  // don't use the stored results.
  else if (query !== queryRequest.query) {
    return null
  }

  // Else, if a search query is in progress, wait for it. Listen
  // for an event to know when it's completed.
  else if (queryRequest.status === QUERY_IN_PROGRESS) {
    if (DEBUG) {
      console.log('[search-debug] App fetch: waiting for in-progress request')
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
    })
  }

  // Else, if a search query is complete, use its data.
  else if (
    queryRequest.status === QUERY_COMPLETE &&
    !!queryRequest.responseData
  ) {
    if (DEBUG) {
      console.log(
        '[search-debug] App fetch: prefetched data was complete, using it'
      )
    }
    return queryRequest.responseData
  }

  // For any other situation, return no data.
  else {
    return null
  }
}

const fetchCodefuelSearchResults = async ({
  query: providedQuery = null,
  page,
  ignoreStoredData = false,
} = {}) => {
  // If no query value is provided, try to get it from the "q"
  // URL parameter.
  const urlParams = getUrlParameters()
  const query = providedQuery || urlParams.q || null

  // If the search results request is already complete or in
  // progress, use that request's data.
  if (!ignoreStoredData) {
    try {
      const priorFetchedData = await getPreviouslyFetchedData({ query })
      if (priorFetchedData) {
        // Save that we've used this data already so that we fetch fresh
        // data the next time the user queries.
        const searchGlobalObj = getSearchGlobal()
        set(searchGlobalObj, 'queryRequest.displayedResults', true)
        return priorFetchedData
      } else {
        if (DEBUG) {
          console.log(
            '[search-debug] App fetch: not using previously-fetched data'
          )
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  if (!query) {
    throw new Error(`Search query must be a non-empty string.`)
  }

  const endpoint = process.env.REACT_APP_SEARCH_QUERY_ENDPOINT_CODEFUEL
  if (!endpoint) {
    throw new Error('Search query endpoint is not defined.')
  }

  let rawSearchResults

  // Return mock search results as needed in development.
  if (
    process.env.NODE_ENV === 'development' &&
    process.env.REACT_APP_MOCK_SEARCH_RESULTS === 'true'
  ) {
    // Mock search results, including network delay.
    rawSearchResults = await new Promise(resolve => {
      setTimeout(() => resolve(getMockCodefuelSearchResults()), 400)
    })
  } else {
    try {
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

      const searchURL = `${endpoint}?${qs.stringify({
        q: query.slice(0, 200), // limited to 200 characters
        // gd: 'some-id', // added server-side
        NumOrganic: getSearchResultCountPerPage(), // number of non-ad results
        NumAds: 3, // ads: mainline count
        NumSidebar: 0, // ads: sidebar count
        Sitelinks: true, // ads: "deep links"
        EnhancedSitelinks: true, // ads: "deep links" with descriptions
        Rating: false, // ads: star ratings for advertisers
        mobileApp: false, // ads: links to app stores for app installs
        adImage: false, // ads: get an image of the product/service
        adsMultiImages: false, // ads: get multiple images of the product/service
        adPrice: false, // ads: get a list of product/services with prices
        consumerRatings: false, // ads: survey ratings for the advertiser
        Localad: false, // ads: include local addresses or phone numbers
        Images: false, // organic result type
        news: true, // organic result type
        videos: true, // organic result type
        PageIndex: pageNumber, // zero-based results page
        // N: 'abcd', // reporting (e.g. traffic sources)
        // L: 500, // reporting (e.g. traffic sources)
        // M: 500, // reporting (e.g. traffic sources)
        // D: 'MMDDYY', // user install date
        af: 1, // content filter: 0 = off, 1 = moderate, 2 = strict
        Relatedsearches: false, // organic result type
        // UserAgent: '', // required only for server-to-server calls
        // UserIp: '', // required only for server-to-server calls
        // Mkt: 'en-US' // TODO
        Format: 'JSON', // JSON or XML
        url: `${window.location.origin}${window.location.pathname}`, // URL of the hosting page
        EnableProductAds: false,
      })}`

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
      rawSearchResults = await response.json()
    } catch (e) {
      throw e
    }
  }

  const formattedSearchResults = formatSearchResults(rawSearchResults)
  return formattedSearchResults
}

export default fetchCodefuelSearchResults

import qs from 'qs'

// TODO: add tests
/**
 * Build the request URL to fetch page information from
 * the Wikipedia API.
 * @param {String} query - The search query, unencoded.
 * @return {String} The URL used in a GET request to fetch
 *   data from Wikipedia.
 */
const constructWikiURL = query => {
  const params = {
    // Get info about a page.
    // https://www.mediawiki.org/wiki/API:Query
    // We also use a generator to search for the most relevant
    // page before fetching that page's info:
    // https://www.mediawiki.org/wiki/API:Query#Generators
    action: 'query',
    // Extracts (i.e. excerpts) settings:
    // https://www.mediawiki.org/w/api.php?action=help&modules=query%2Bextracts
    // Only get content in the first section of the page.
    exintro: true,
    exlimit: 3, // The max number of extracts to fetch.
    explaintext: true, // Get the extract as plain text.
    exsentences: 1, // Only get the eextract's first sentence.
    // For JSON, we should use formatversion=2:
    // https://www.mediawiki.org/wiki/API:Page_info_in_search_results
    format: 'json',
    formatversion: 2,
    // Given user input, find the best-matching pages:
    // https://www.mediawiki.org/wiki/API:Prefixsearch
    generator: 'prefixsearch',
    gpslimit: 1, // Limit results to one page.
    // Namespace 0 is for "real" content articles:
    // https://www.mediawiki.org/wiki/Manual:Namespace
    gpsnamespace: 0,
    gpssearch: query,
    // Images settings:
    // https://www.mediawiki.org/w/api.php?action=help&modules=query%2Bimages
    // Note that if we want URLs of images, we probably have to
    // make another API call:
    // https://stackoverflow.com/a/8363589
    // TODO: remove this if we don't use the images.
    imlimit: 4, // The max number of images to fetch.
    // Info settings:
    // https://www.mediawiki.org/w/api.php?action=help&modules=query%2Binfo
    inprop: 'url', // Get the URL of the Wikipedia page.
    // Make an unauthenticated CORS request:
    // https://www.mediawiki.org/wiki/API:Cross-site_requests
    origin: '*',
    // Page images settings:
    // https://www.mediawiki.org/w/api.php?action=help&modules=query%2Bpageimages
    pilimit: 1, // The max number of page images to fetch.
    pithumbsize: 200, // The maximum image width in pixels.
    // All the properties to fetch for the page:
    // https://www.mediawiki.org/w/api.php?action=help&modules=query
    prop: 'description|extracts|imageinfo|images|info|pageimages',
    // Allow automatic page redirects:
    // https://www.mediawiki.org/wiki/API:Query#Resolving_redirects
    redirects: true,
  }
  const searchStr = qs.stringify(params)
  const urlBase = 'https://en.wikipedia.org/w/api.php'
  return `${urlBase}?${searchStr}`
}

// TODO: add tests
/**
 * Call Wikipedia to fetch the most relevant page(s).
 * @param {String} query - The search query, unencoded.
 * @return {Promise<Object>} The Wikipedia API response.
 */
const fetchWikipediaResults = async (query = null) => {
  const endpoint = constructWikiURL(query)
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }
  return fetch(endpoint, {
    method: 'GET',
    headers: headers,
  }).then(response => {
    return response.json().then(responseJSON => {
      return responseJSON
    })
  })
}

export default fetchWikipediaResults

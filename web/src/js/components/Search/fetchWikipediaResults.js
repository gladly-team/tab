import qs from 'qs'

// TODO
const constructWikiURL = query => {
  const params = {
    action: 'query',
    generator: 'prefixsearch',
    gpssearch: 'new en', // TODO: use query
    gpsnamespace: 0,
    gpslimit: 1,
    prop: 'pageimages|extracts|description|images|info|imageinfo',
    pilimit: 2,
    exintro: true,
    explaintext: true,
    exsentences: 1,
    exlimit: 3,
    formatversion: 2,
    pithumbsize: 62,
    imlimit: 4,
    inprop: 'url',
    format: 'json',
    origin: '*',
  }
  const searchStr = qs.stringify(params)
  const urlBase = 'https://en.wikipedia.org/w/api.php'
  return `${urlBase}?${searchStr}`
}

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

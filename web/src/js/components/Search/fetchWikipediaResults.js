// TODO
const constructWikiURL = query => {
  const origin = '*'
  return `https://en.wikipedia.org/w/api.php?action=query&generator=prefixsearch&gpssearch=new%20en&gpsnamespace=0&gpslimit=1&prop=pageimages|extracts|description|images|info|imageinfo&pilimit=2&exintro&explaintext&exsentences=1&exlimit=3&formatversion=2&pithumbsize=62&imlimit=4&inprop=url&format=json&origin=${origin}`
}

/**
 * Call the YPA API to display search results in their iframe.
 * @param {String} query - The search query, unencoded.
 * @return {Promise<Object>}
 */
const fetchWikipediaResults = async (query = null) => {
  const endpoint = constructWikiURL(query)
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    // Origin: window.location.origin,
  }
  return fetch(endpoint, {
    method: 'GET',
    headers: headers,
  }).then(response => {
    console.log('response', response)
    return response.json().then(responseJSON => {
      console.log('responseJSON', responseJSON)
      return responseJSON
    })
  })
}

export default fetchWikipediaResults

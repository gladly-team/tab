// import { getCountry } from 'js/utils/client-location'

/**
 * Call our search API endpoint.
 * https://docs.microsoft.com/en-us/rest/api/cognitiveservices-bingsearch/bing-web-api-v7-reference#mkt
 * @return {Promise<String|null>} The 5-character market code of structure
 *   <ISO language code>-<ISO country code>, if both language and country
 *   are known; else, null.
 */
const getBingMarketCode = async () => {
  // TODO
  // // This may be a 2-character or 5-character code.
  // // https://stackoverflow.com/a/25603630
  // const language = navigator.languages
  //     ? navigator.languages[0]
  //     : navigator.language || navigator.userLanguage
  return 'en-US'
}

export default getBingMarketCode

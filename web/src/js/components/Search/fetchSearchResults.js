import { cloneDeep } from 'lodash/lang'
import YPAConfiguration from 'js/components/Search/YPAConfiguration'

// This expects the YPA ads script to already have been loaded.

/**
 * Call the YPA API to display search results in their iframe.
 * @param {String} query - The search query, unencoded.
 * @param {Function} onNoResults - A callback function that will
 *   be invoked if there are zero results for the search.
 * @return {undefined}
 */
const fetchSearchResults = (query = null, onNoResults = () => {}) => {
  const config = cloneDeep(YPAConfiguration)
  config.ypaAdSlotInfo[1].ypaOnNoAd = onNoResults

  // Fetch search results.
  // Note: YPA mutates objects we pass to it, so make sure to
  // clone everything we pass.
  window.ypaAds.insertMultiAd(config)
}

export default fetchSearchResults

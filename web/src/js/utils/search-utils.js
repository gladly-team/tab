import { SEARCH_PROVIDER_BING, SEARCH_PROVIDER_YAHOO } from 'js/constants'

// Returns whether react-snap is the one running the app.
// This is useful to adjust what we want to prerender.
// https://github.com/stereobooster/react-snap/issues/245#issuecomment-414347911
export const isReactSnapClient = () => {
  try {
    return navigator.userAgent === 'ReactSnap'
  } catch (e) {
    return false
  }
}

/**
 * Return which search provider to use.
 * @return {String} The search provider name, either 'bing' or 'yahoo'.
 */
export const getSearchProvider = () => {
  const envSearchProvider = process.env.REACT_APP_SEARCH_PROVIDER
  switch (envSearchProvider) {
    case SEARCH_PROVIDER_BING:
      return SEARCH_PROVIDER_BING
    case SEARCH_PROVIDER_YAHOO:
      return SEARCH_PROVIDER_YAHOO
    default:
      return SEARCH_PROVIDER_YAHOO
  }
}

/**
 * Whether to enable pagination buttons for Bing search results.
 * @return {Boolean} Whether to show pagination buttons.
 */
export const showBingPagination = () => true

/**
 * Get how many search results to fetch per page.
 * @return {Number} The count of search results per page.
 */
export const getSearchResultCountPerPage = () => 10

/**
 * Add width and height parameters to a Bing thumbnail URL so we
 * fetch an image whose dimensions will fill the desired space.
 * See:
 * https://docs.microsoft.com/en-us/azure/cognitive-services/bing-entities-search/resize-and-crop-thumbnails
 * @param {String} thumbnailURL - The Bing thumbnail image URL
 * @param {Object} desiredDimensions - The width and height of the
 *   space we want to fill.
 * @param {Number} desiredDimensions.width
 * @param {Number} desiredDimensions.height
 * @return {String} The thumbnail URL with width and height specified
 *   in the URL parameters.
 */
export const getBingThumbnailURLToFillDimensions = (
  thumbnailURL,
  desiredDimensions
) => {
  // If we're missing any required data, don't modify the
  // thumbnail URL.
  if (
    !(desiredDimensions && desiredDimensions.width && desiredDimensions.height)
  ) {
    return thumbnailURL
  }

  const url = new URL(thumbnailURL)
  url.searchParams.set('w', desiredDimensions.width)
  url.searchParams.set('h', desiredDimensions.height)

  // Crop the image using "smart ratio" cropping.
  url.searchParams.set('c', 7)
  return url.href
}

/**
 * Clip text to max characters at the most recent word break,
 * adding ellipses.
 * @param {String} text - The text to clip
 * @param {Number} maxCharacters - The maximum number of characters
 *   to allow, excluding ellipses
 * @return {String} The new text, clipped if it exceeded the max
 *   characters, or unchanged if it had fewer.
 */
export const clipTextToNearestWord = (text, maxCharacters) => {
  if (!(text && text.length)) {
    return text
  }
  if (maxCharacters >= text.length) {
    return text
  }

  // How many characters we should clip *below* the max character
  // limit. For example, if there is no whitespace at all, we
  // shouldn't return an empty string. Likewise, we probably want
  // to cut a long word in half rather than return very little text.
  const MAX_EXTRA_CHARS_CLIPPED = 8

  // The whitespace nearest to the index of maxCharacters.
  const indexOfPrevWhitespace = text.lastIndexOf(' ', maxCharacters)
  const indexToClip =
    indexOfPrevWhitespace < 1 ||
    maxCharacters - indexOfPrevWhitespace > MAX_EXTRA_CHARS_CLIPPED
      ? maxCharacters
      : indexOfPrevWhitespace
  return `${text.substring(0, indexToClip)} ...`
}

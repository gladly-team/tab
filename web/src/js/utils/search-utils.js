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
 * Add width and height parameters to a Bing thumbnail URL so we
 * fetch an image whose dimensions will fill or exceed the desired
 * space. See:
 * https://docs.microsoft.com/en-us/azure/cognitive-services/bing-entities-search/resize-and-crop-thumbnails
 * @param {String} thumbnailURL - The Bing thumbnail image URL
 * @param {Object} imageDimensions - The width and height of the
 *   thumbnail image.
 * @param {Number} imageDimensions.width
 * @param {Number} imageDimensions.height
 * @param {Object} desiredDimensions - The width and height of the
 *   space we want to fill.
 * @param {Number} desiredDimensions.width
 * @param {Number} desiredDimensions.height
 * @return {String} The thumbnail URL with width and height specified
 *   in the URL parameters.
 */
export const getBingThumbnailURLToFillDimensions = (
  thumbnailURL,
  imageDimensions,
  desiredDimensions
) => {
  // If we're missing any required data, don't modify the
  // thumbnail URL.
  if (
    !(
      imageDimensions &&
      imageDimensions.width &&
      imageDimensions.height &&
      desiredDimensions &&
      desiredDimensions.width &&
      desiredDimensions.height
    )
  ) {
    return thumbnailURL
  }
  // Choose whatever ratio is bigger so we fill the space.
  const scalingRatio = Math.max(
    desiredDimensions.width / imageDimensions.width,
    desiredDimensions.height / imageDimensions.height
  )

  // TODO: if the desired dimenion is smaller, use it, because
  //   we'll request a cropped image.
  const imgWidth = Math.floor(scalingRatio * imageDimensions.width)
  const imgHeight = Math.floor(scalingRatio * imageDimensions.height)
  const url = new URL(thumbnailURL)
  url.searchParams.set('w', imgWidth)
  url.searchParams.set('h', imgHeight)

  // Crop the image using "smart ratio" cropping.
  url.searchParams.set('c', 7)
  return url.href
}


// Time to wait for the entire ad auction before
// calling the ad server.
export const AUCTION_TIMEOUT = 1000

// Time to wait for the consent management platform (CMP)
// to respond.
export const CONSENT_MANAGEMENT_TIMEOUT = 50

// Timeout for individual bidders.
export const BIDDER_TIMEOUT = 700

// "Vertical ad" = the ad that's typically rectangular
// or taller than it is wide. Historically, the right-side
// rectangle ad.
// "Horizontal ad" = the ad that's typically wider than
// it is tall. Historically, the bottom long leaderboard ad.
export const VERTICAL_AD_ID = '/43865596/HBTR'
export const VERTICAL_AD_SLOT_ID = 'div-gpt-ad-1464385677836-0'
export const HORIZONTAL_AD_ID = '/43865596/HBTL'
export const HORIZONTAL_AD_SLOT_ID = 'div-gpt-ad-1464385742501-0'

// TODO: limit ad sizes with feature flag
// TODO: limit new ad sizes to a test group

/**
 * Get an array of ad sizes (each an array with two numbers)
 * of the acceptable ad sizes to display for the veritcal
 * ad.
 * @return {Array[Array]} An array of ad sizes
 */
export const getVerticalAdSizes = () => {
  return [
    [300, 250],
    // Wider than we probably want to allow.
    // [336, 280],
    [250, 250],
    [160, 600],
    [120, 600],
    [120, 240],
    [240, 400],
    [234, 60],
    [180, 150],
    [125, 125],
    [120, 90],
    [120, 60],
    [120, 30],
    [230, 33],
    [300, 600]
  ]
}

/**
 * Get an array of ad sizes (each an array with two numbers)
 * of the acceptable ad sizes to display for the horizontal
 * ad.
 * @return {Array[Array]} An array of ad sizes
 */
export const getHorizontalAdSizes = () => {
  return [
    [728, 90],
    [728, 210],
    [720, 300],
    // Taller than we probably want to allow.
    // [500, 350],
    // [550, 480],
    [468, 60]
  ]
}

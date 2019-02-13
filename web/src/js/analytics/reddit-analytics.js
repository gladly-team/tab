import logger from 'js/utils/logger'

// https://www.reddithelp.com/en/categories/advertising/creating-ads/installing-reddit-conversion-pixel
const redditAnalytics = (...args) => {
  const DEBUG = false

  const rdt = window.rdt
  if (!rdt) {
    logger.error('Reddit analytics are not available on `window.rdt`.')
  }
  try {
    if (DEBUG) {
      console.log('Logging Reddit event with args:', args)
    }
    rdt.apply(this, args)
  } catch (e) {
    logger.error(e)
  }
}

export default redditAnalytics

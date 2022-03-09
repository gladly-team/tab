import logger from 'js/utils/logger'

const googleAnalytics = (...args) => {
  const { gtag } = window
  try {
    gtag.apply(this, args)
  } catch (e) {
    logger.error(e)
  }
}

export default googleAnalytics

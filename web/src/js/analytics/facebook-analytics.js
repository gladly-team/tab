import logger from 'js/utils/logger'

const facebookAnalytics = (...args) => {
  const DEBUG = false

  const fbq = window.fbq
  if (!fbq) {
    logger.error('Facebook analytics are not available on `window.fbq`.')
  }
  try {
    if (DEBUG) {
      console.log('Logging Facebook event with args:', args)
    }
    fbq.apply(this, args)
  } catch (e) {
    logger.error(e)
  }
}

export default facebookAnalytics

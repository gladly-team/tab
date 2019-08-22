import logger from 'js/utils/logger'

const quoraAnalytics = (...args) => {
  const DEBUG = false

  const qp = window.qp
  if (!qp) {
    logger.error('Quora analytics are not available on `window.qp`.')
  }
  try {
    if (DEBUG) {
      console.log('Logging Quora event with args:', args)
    }
    qp.apply(this, args)
  } catch (e) {
    logger.error(e)
  }
}

export default quoraAnalytics

// https://github.com/react-ga/react-ga
import ReactGA from 'react-ga'
import logger from 'js/utils/logger'

const DEBUG = false
const debugLogger = (...args) => {
  if (DEBUG) {
    console.log(...args)
  }
}

try {
  // TODO: env var for app ID
  ReactGA.initialize('UA-24159386-1')
} catch (e) {
  logger.error(e)
}

// Wraps ReactGA methods in try/catch.
class ReactGAWrapper {
  static pageview() {
    try {
      const url = `${window.location.pathname}${window.location.search}`
      debugLogger(`Logging GA pageview with url: ${url}`)
      ReactGA.pageview(url)
    } catch (e) {
      logger.error(e)
    }
  }

  static event(gaEvent) {
    try {
      debugLogger('Logging GA event:', JSON.stringify(gaEvent))
      ReactGA.event(gaEvent)
    } catch (e) {
      logger.error(e)
    }
  }

  static ga(gaAction, gaEvent) {
    try {
      debugLogger('Logging GA event:', gaAction, JSON.stringify(gaEvent))
      ReactGA.ga(gaAction, gaEvent)
    } catch (e) {
      logger.error(e)
    }
  }
}

export default ReactGAWrapper

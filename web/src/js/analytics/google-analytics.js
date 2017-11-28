
// https://github.com/react-ga/react-ga
import ReactGA from 'react-ga'

const DEBUG = true
const debugLogger = (msg) => {
  if (DEBUG) {
    console.log(msg)
  }
}

try {
  // TODO: env var for app ID
  ReactGA.initialize('UA-24159386-1')
} catch (e) {
  console.error('Failed to initialize Google Analytics.', e)
}

// Wraps ReactGA methods in try/catch.
class ReactGAWrapper {
  static pageview () {
    try {
      const url = `${window.location.pathname}${window.location.search}`
      debugLogger(`Logging GA pageview with url: ${url}`)
      ReactGA.pageview(url)
    } catch (e) {
      console.error('Failed to track Google Analytics pageview.', e)
    }
  }

  static event (...args) {
    try {
      debugLogger('Logging GA event with args:', args)
      ReactGA.event(args)
    } catch (e) {
      console.error('Failed to track Google Analytics event.', e)
    }
  }
}

export default ReactGAWrapper

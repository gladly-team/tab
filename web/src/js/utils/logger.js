import { isError } from 'lodash/lang'
import * as Sentry from '@sentry/browser'

const logLevels = {}
logLevels.LOG = 'log'
logLevels.DEBUG = 'debug'
logLevels.INFO = 'info'
logLevels.WARN = 'warn'
logLevels.ERROR = 'error'

const logger = {}

logger.log = msg => {
  console.log(msg)
  log(msg, logLevels.LOG)
}

logger.debug = msg => {
  console.debug(msg)
  log(msg, logLevels.DEBUG)
}

logger.info = msg => {
  console.info(msg)
  log(msg, logLevels.INFO)
}

logger.warn = msg => {
  console.warn(msg)
  log(msg, logLevels.WARN)
}

logger.error = msg => {
  console.error(msg)
  log(msg, logLevels.ERROR)
}

const log = (msg, logLevel) => {
  // Sentry expects one of 'info', 'warning', or 'error'
  var level
  switch (logLevel) {
    case logLevels.LOG:
      level = 'info'
      break
    case logLevels.DEBUG:
      level = 'info'
      break
    case logLevels.INFO:
      level = 'info'
      break
    case logLevels.WARN:
      level = 'warning'
      break
    case logLevels.ERROR:
      level = 'error'
      break
    default:
      level = 'error'
  }
  if (isError(msg)) {
    Sentry.captureException(msg)
  } else {
    Sentry.captureMessage(msg, level)
  }
}

export default logger

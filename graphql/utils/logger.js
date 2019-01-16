/* eslint no-console: 0 */
import { isError } from 'lodash/lang'
import Sentry, { sentryContextWrapper } from './sentry-logger'
import config from '../config'

const logLevels = {}
logLevels.LOG = 'log'
logLevels.DEBUG = 'debug'
logLevels.INFO = 'info'
logLevels.WARN = 'warn'
logLevels.ERROR = 'error'
logLevels.FATAL = 'fatal'
const logLevelsOrder = [
  logLevels.DEBUG,
  logLevels.LOG,
  logLevels.INFO,
  logLevels.WARN,
  logLevels.ERROR,
  logLevels.FATAL,
]

/*
 * A wrapper for loggers to use to set additional context for logs.
 * This wraps and invokes the provided function.
 * @param {object} userContext - The user authorizer object.
 * @param {function} func - The function to wrap.
 */
export const loggerContextWrapper = (userContext, lambdaEvent, func) => {
  switch (config.LOGGER) {
    case 'console':
      return func()
    case 'sentry':
      return sentryContextWrapper(userContext, lambdaEvent, func)
    default:
      return func()
  }
}

export const shouldLog = (logLevel, globalLogLevel) =>
  logLevelsOrder.indexOf(logLevel) >= logLevelsOrder.indexOf(globalLogLevel)

const log = (msg, logLevel) => {
  if (!shouldLog(logLevel, config.LOG_LEVEL)) {
    return
  }
  switch (config.LOGGER) {
    case 'console': {
      switch (logLevel) {
        case logLevels.DEBUG:
          console.debug(msg)
          break
        case logLevels.LOG:
          console.log(msg)
          break
        case logLevels.INFO:
          console.info(msg)
          break
        case logLevels.WARN:
          console.warn(msg)
          break
        case logLevels.ERROR:
          console.error(msg)
          break
        case logLevels.FATAL:
          console.error(msg)
          break
        default:
          console.error(msg)
      }
      break
    }
    case 'sentry': {
      // Sentry expects 'warning', not 'warn'
      const level = logLevel === logLevels.WARN ? 'warning' : logLevel
      if (isError(msg)) {
        Sentry.captureException(msg, {
          level,
        })
      } else {
        Sentry.captureMessage(msg, {
          level,
        })
      }
      break
    }
    default:
      break
  }
}

const logger = {};

logger.log = msg => {
  log(msg, logLevels.LOG)
}

logger.debug = msg => {
  log(msg, logLevels.DEBUG)
}

logger.info = msg => {
  log(msg, logLevels.INFO)
}

logger.warn = msg => {
  log(msg, logLevels.WARN)
}

logger.error = msg => {
  log(msg, logLevels.ERROR)
}

logger.fatal = msg => {
  log(msg, logLevels.FATAL)
}

/*
 * Log the error, adding the error ID to the error message.
 * @param {object} err - The error.
 * @param {string} errId - The error ID
 * @return {null}
 */
export const logErrorWithId = (err, errId) => {
  // eslint-disable-next-line no-param-reassign
  err.message = `${err.message}: Error ID ${errId}`
  logger.error(err)
}

export default logger

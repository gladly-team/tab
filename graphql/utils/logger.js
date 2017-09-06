
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
  logLevels.FATAL
]


// TODO: set up logging via Sentry.
const logger = {}

logger.log = (msg) => {
  log(msg, logLevels.LOG)
}

logger.debug = (msg) => {
  log(msg, logLevels.DEBUG)
}

logger.info = (msg) => {
  log(msg, logLevels.INFO)
}

logger.warn = (msg) => {
  log(msg, logLevels.WARN)
}

logger.error = (msg) => {
  log(msg, logLevels.ERROR)
}

logger.fatal = (msg) => {
  log(msg, logLevels.FATAL)
}

/*
 * Log the error, adding the error ID to the error message.
 * @param {object} err - The error.
 * @param {string} errId - The error ID
 * @return {null}
 */
export const logErrorWithId = (err, errId) => {
  err.message = `${err.message}: Error ID ${errId}`
  logger.error(err)
}

export const shouldLog = (logLevel, globalLogLevel) => {
  return (
    logLevelsOrder.indexOf(logLevel) >=
    logLevelsOrder.indexOf(globalLogLevel)
  )
}

const log = (msg, logLevel) => {
  if (!shouldLog(logLevel, config.LOG_LEVEL)) { return }
  console.log(msg)
}

export default logger

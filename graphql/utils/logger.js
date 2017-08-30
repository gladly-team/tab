
// TODO: set up logging via Sentry.
const logger = {}

logger.log = (msg) => {
  console.log(msg)
}

logger.debug = (msg) => {
  console.debug(msg)
}

logger.info = (msg) => {
  console.info(msg)
}

logger.warn = (msg) => {
  console.warn(msg)
}

logger.error = (msg) => {
  console.error(msg)
}

logger.fatal = (msg) => {
  console.error(msg)
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

export default logger

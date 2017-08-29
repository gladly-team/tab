
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

export default logger

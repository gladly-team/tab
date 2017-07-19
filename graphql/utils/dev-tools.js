
import config from '../config'

const logger = {}

// TODO: break out, use Sentry
logger.log = function (msg) {
  console.log(msg)
}

logger.error = function (msg, error) {
  console.error(msg, error)
  console.error(error.stack)
}

// TODO: disable in test/prod
const DBLogger = {
  action: (action, params) => {
    if (config.DEVELOPMENT_LOGGING_ENABLED) {
      console.log(`Received action: ${action} with params: `, params)
    }
  },
  response: (action, data) => {
    if (config.DEVELOPMENT_LOGGING_ENABLED) {
      console.log(`Response from action: ${action}: `, data)
    }
  }
}

export {
  logger,
  DBLogger
}

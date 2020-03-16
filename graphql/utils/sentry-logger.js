import * as Sentry from '@sentry/node'
import config from '../config'

/*
 * A wrapper for loggers to use to set additional context for logs.
 * This wraps and invokes the provided function.
 * @param {object} userContext - The user authorizer object.
 * @param {function} func - The function to wrap.
 */
export const sentryContextWrapper = async (userContext, lambdaEvent, func) => {
  Sentry.setUser({
    id: userContext.id,
    email: userContext.email,
  })
  try {
    return await func(lambdaEvent)
  } catch (error) {
    // https://docs.sentry.io/platforms/node/serverless/
    Sentry.captureException(error)
    await Sentry.flush(2000)
    return error
  }
}

/*
 * Return the Sentry DSN, or null if any environment variable
 * required to construct the DSN are missing. Throw an error if
 * we are using the Sentry logger and env vars are missing.
 * @return {string | null}
 */
const getSentryDSN = () => {
  if (
    !config.SENTRY_PUBLIC_KEY ||
    !config.SENTRY_PRIVATE_KEY ||
    !config.SENTRY_PROJECT_ID
  ) {
    if (config.LOGGER === 'sentry') {
      throw new Error('Sentry configuration is incorrect.')
    } else {
      return null
    }
  }
  return `https://${config.SENTRY_PUBLIC_KEY}:${
    config.SENTRY_PRIVATE_KEY
  }@sentry.io/${config.SENTRY_PROJECT_ID}`
}

// Configure the Sentry logger instance.
// https://docs.sentry.io/clients/node/config/
const sentryDSN = getSentryDSN()
Sentry.init({
  dsn: sentryDSN,
  environment: config.SENTRY_STAGE,
})

export default Sentry

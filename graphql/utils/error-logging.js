
import logger from './logger'

/*
 * Wrap a function and log all exceptions, then re-throw the
 * exception.
 * @param {function} func - The function to wrap.
 * @return {null}
 */
export const logExceptionsWrapper = (func) => {
  return function () {
    try {
      return func.apply(this, arguments)
    } catch (e) {
      logger.error(e)
      throw e
    }
  }
}

/*
 * Log GraphQL errors.
 * @param {object} graphQLError - The GraphQL error.
 * @return {null}
 */
const logError = (graphQLError) => {
  // TODO: set up logging via Sentry.
  logger.log('Inside logError!')
  logger.error(graphQLError)
}

/*
 * Format GraphQL error before sending to the client.
 * Spec: https://github.com/graphql/graphql-js/blob/master/src/error/formatError.js#L19
 * @param {object} graphQLError - The GraphQL error.
 * @return {object} The error to send to the client.
 */
export const formatError = (graphQLError) => {
  // TODO: return obfuscated message to prevent leakage of
  //   sensitive info.
  // See graphql-errors package:
  // https://github.com/kadirahq/graphql-errors/blob/master/lib/index.js#L29
  return {
    message: graphQLError.message,
    locations: graphQLError.locations,
    path: graphQLError.path
  }
}

/*
 * The handler for any GraphQL errors, primarily for logging and
 * formatting errors.
 * We will use this as the `formatError` function in graphQLHTTP.
 * @param {object} graphQLError - The GraphQL error.
 * @return {object} The error to send to the client (optionally formatted).
 */
export const handleError = (graphQLError) => {
  logError(graphQLError)
  return formatError(graphQLError)
}

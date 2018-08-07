
import logger from './logger'
import { get } from 'lodash/object'

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
 * Format GraphQL error before sending to the client.
 * Spec: https://github.com/graphql/graphql-js/blob/master/src/error/formatError.js#L19
 * @param {object} graphQLError - The GraphQL error.
 * @return {object} The error to send to the client.
 */
export const formatError = (graphQLError) => {
  return {
    message: graphQLError.message,
    locations: graphQLError.locations,
    path: graphQLError.path,
    code: get(graphQLError, 'originalError.code', null)
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
  logger.error(graphQLError)

  // TODO: probably want to return different message
  // for some error types (e.g. UnauthorizedQueryException)

  // // Format and return the error.
  // graphQLError.message = `Internal Error: ${errId}`
  return formatError(graphQLError)
}

import { get } from 'lodash/object'
import logger from './logger'
import { USER_DOES_NOT_EXIST, UnauthorizedQueryException } from './exceptions'

/*
 * Wrap a function and log all exceptions, then re-throw the
 * exception.
 * @param {function} func - The function to wrap.
 * @return {null}
 */
export const logExceptionsWrapper = func =>
  function wrapperFunc(...args) {
    try {
      return func.apply(this, args)
    } catch (e) {
      logger.error(e)
      throw e
    }
  }

/*
 * Format GraphQL error before sending to the client.
 * Spec: https://github.com/graphql/graphql-js/blob/master/src/error/formatError.js#L19
 * @param {object} graphQLError - The GraphQL error.
 * @return {object} The error to send to the client.
 */
export const formatError = graphQLError => ({
  message: graphQLError.message,
  locations: graphQLError.locations,
  path: graphQLError.path,
  code: get(graphQLError, 'originalError.code', null),
})

/*
 * Determine whether we should log an error. Some errors are
 * fairly expected and shouldn't be logged.
 * @param {object} graphQLError - The GraphQL error.
 * @return {Boolean} Whether we should log the error.
 */
const shouldLogError = graphQLError => {
  const errorCodesToSkipLogging = [
    USER_DOES_NOT_EXIST, // can happen during sign up
    UnauthorizedQueryException.code, // can happen during logout (when storage is cleared)
  ]
  const errCode = get(graphQLError, 'originalError.code')
  return errorCodesToSkipLogging.indexOf(errCode) === -1
}

/*
 * The handler for any GraphQL errors, primarily for logging and
 * formatting errors.
 * We will use this as the `formatError` function in graphQLHTTP.
 * @param {object} graphQLError - The GraphQL error.
 * @return {object} The error to send to the client (optionally formatted).
 */
export const handleError = graphQLError => {
  if (shouldLogError(graphQLError)) {
    logger.error(graphQLError)
  }

  // TODO: probably want to return different message
  // for some error types (e.g. UnauthorizedQueryException)

  // // Format and return the error.
  // graphQLError.message = `Internal Error: ${errId}`
  return formatError(graphQLError)
}

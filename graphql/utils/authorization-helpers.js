
import { get } from 'lodash/object'

/**
 * Get the user claims object from an AWS Lambda event object.
 * @param {obj} lambdaEvent - The "event" object provided to AWS Lambda.
 * @return {obj} The object of user claims.
 */
export const getUserClaimsFromLambdaEvent = (lambdaEvent) => {
  // With a custom authorizer, we access keys on requestContext.authorizer object.
  // https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-mapping-template-reference.html#context-variable-reference
  return get(lambdaEvent, 'requestContext.authorizer', {})
}

/**
 * Check if the user claims are sufficient for authorization.
 * Note that this is not responsible for checking the validity of
 * the token that carries these claims.
 * @param {obj} userClaims - The object of claims about the user
 * @return {boolean} Whether the user is authorized.
 */
export const isUserAuthorized = (userClaims) => {
  const userId = userClaims['id']
  const emailVerified = userClaims['email_verified'] === 'true'
  if (!userId || !emailVerified) {
    return false
  }
  return true
}

/**
 * Create the GraphQL context object.
 * @param {obj} userClaims - The object of claims about the user
 * @return {obj} The object of user claims.
 */
export const createGraphQLContext = (userClaims) => {
  return {
    user: {
      id: userClaims['id'],
      email: userClaims['email'],
      emailVerified: userClaims['email_verified'] === 'true'
    }
  }
}

export const permissionAuthorizers = {}
permissionAuthorizers.userIdMatchesHashKey = (user, hashKey, _) => {
  return user.id === hashKey
}

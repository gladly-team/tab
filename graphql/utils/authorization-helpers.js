
import { get } from 'lodash/object'

/**
 * Get the user claims object from an AWS Lambda event object.
 * @param {obj} lambdaEvent - The "event" object provided to AWS Lambda.
 * @return {obj} The object of user claims.
 */
export const getUserClaimsFromLambdaEvent = (lambdaEvent) => {
  return get(lambdaEvent, 'requestContext.authorizer.claims', {})
}

/**
 * Check if the user claims are sufficient for authorization.
 * Note that this is not responsible for checking the validity of
 * the token that carries these claims.
 * @param {obj} userClaims - The object of claims about the user
 * @return {boolean} Whether the user is authorized.
 */
export const isUserAuthorized = (userClaims) => {
  const userId = userClaims['sub']
  const username = userClaims['cognito:username']
  const emailVerified = userClaims['email_verified'] === 'true'
  if (!userId || !username || !emailVerified) {
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
  const userId = userClaims['sub']
  const username = userClaims['cognito:username']
  const email = userClaims['email']
  const emailVerified = userClaims['email_verified'] === 'true'
  return {
    user: {
      id: userId,
      username: username,
      email: email,
      emailVerified: emailVerified
    }
  }
}

export const permissionAuthorizers = {}
permissionAuthorizers.userIdMatchesHashKey = (user, hashKey, _) => {
  return user.id === hashKey
}
permissionAuthorizers.usernameMatchesHashKey = (user, hashKey) => {
  return user.username === hashKey
}

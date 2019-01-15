import { get } from 'lodash/object'

/**
 * Get the user claims object from an AWS Lambda event object.
 * @param {obj} lambdaEvent - The "event" object provided to AWS Lambda.
 * @return {obj} The object of user claims.
 */
export const getUserClaimsFromLambdaEvent = lambdaEvent => {
  // With a custom authorizer, we access keys on requestContext.authorizer object.
  // https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-mapping-template-reference.html#context-variable-reference
  return get(lambdaEvent, 'requestContext.authorizer', {})
}

/**
 * Create the GraphQL context object.
 * @param {obj} userClaims - The object of claims about the user
 * @return {obj} The object of user claims.
 */
export const createGraphQLContext = userClaims => {
  return {
    user: {
      // The id will not exist for unauthenticated users.
      id: userClaims['id'] || null,
      // The email and emailVerified properties may not exist for
      // anonymous users.
      email: userClaims['email'] || null,
      // The email_verified claim is a string.
      emailVerified: userClaims['email_verified']
        ? userClaims['email_verified'] === 'true'
        : false,
    },
  }
}

// Permission authorizers, used in models
export const permissionAuthorizers = {}
permissionAuthorizers.userIdMatchesHashKey = (user, hashKey, _) => {
  return user.id === hashKey
}
permissionAuthorizers.allowAll = () => true

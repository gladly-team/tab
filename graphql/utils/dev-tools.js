
import {
  createGraphQLContext,
  getUserClaimsFromLambdaEvent,
  isUserAuthorized
} from './authorization-helpers'
import jwtDecode from 'jwt-decode'

/**
 * Take a user token, return an object of user claims in the same
 * format that our authorizer returns from AWS Lambda.
 * Important: this is insecure and for local development only.
 * @param {string} authorizationToken - The user's ID token sent in the
 *   Authorization header
 * @return {obj} The object of user claims.
 */
function mockAuthorizer (authorizationToken) {
  if (!authorizationToken) {
    const defaultUserId = 'abcdefghijklmno'
    const defaultEmail = 'kevin@example.com'
    console.warn('Warning: dev user is missing an Authorization token.')
    console.warn(`Using default user with id "${defaultUserId}"" and email "${defaultEmail}".`)
    // Default user. Helpful for GraphiQL until we support it with
    // an Authorization header.
    // See: https://github.com/graphql/graphiql/issues/59
    return {
      id: defaultUserId,
      email: defaultEmail,
      email_verified: true
    }
  }
  const parsedJwt = jwtDecode(authorizationToken)
  return {
    id: parsedJwt.sub,
    email: parsedJwt.email,
    email_verified: parsedJwt.email_verified.toString()
  }
}

// Approximate an AWS Lambda event object from the request.
// https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-set-up-simple-proxy.html#api-gateway-simple-proxy-for-lambda-input-format
//
// {
//     "resource": "Resource path",
//     "path": "Path parameter",
//     "httpMethod": "Incoming request's method name"
//     "headers": {Incoming request headers}
//     "queryStringParameters": {query string parameters }
//     "pathParameters":  {path parameters}
//     "stageVariables": {Applicable stage variables}
//     "requestContext": {Request context, including authorizer-returned key-value pairs}
//     "body": "A JSON string of the request payload."
//     "isBase64Encoded": "A boolean flag to indicate if the applicable request payload is Base64-encode"
// }
export const generateLambdaEventObjFromRequest = (req) => {
  // Get the user claims from their token.
  // Important: this is insecure and for local development only.
  const authorizerProperties = mockAuthorizer(req.header('Authorization'))
  return {
    resource: '',
    path: req.url,
    httpMethod: req.method,
    headers: req.headers,
    queryStringParameters: req.query,
    pathParameters: {},
    stageVariables: {},
    requestContext: {
      path: req.url,
      accountId: '123456789',
      resourceId: 'abcdef',
      stage: 'dev',
      authorizer: {
        ...authorizerProperties
      },
      requestId: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
      identity: {
        cognitoIdentityPoolId: null,
        accountId: null,
        cognitoIdentityId: null,
        caller: null,
        apiKey: '',
        sourceIp: '123.4.567.890',
        accessKey: null,
        cognitoAuthenticationType: null,
        cognitoAuthenticationProvider: null,
        userArn: null,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 Safari/537.36',
        user: null
      },
      resourcePath: '/graphql',
      httpMethod: req.method,
      apiId: 'abcdefghij'
    },
    body: JSON.stringify(req.body),
    isBase64Encoded: false
  }
}

// An analogue to the AWS Lamda handler (../handler.handler)
// but used with graphQLHTTP.
export const getGraphQLContextFromRequest = (req) => {
  const event = generateLambdaEventObjFromRequest(req)
  const claims = getUserClaimsFromLambdaEvent(event)
  if (!isUserAuthorized(claims)) {
    console.warn('User is not authorized.')
  }
  return createGraphQLContext(claims)
}

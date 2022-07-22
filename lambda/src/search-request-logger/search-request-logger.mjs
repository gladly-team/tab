import { get } from 'lodash/object'
import fetch from 'node-fetch'

const getAuthorizationHeaderFromMessage = (messageUser) {
  if (!messageUser) {
    return 'unauthenticated'
  }

  if (messageUser.idToken) {
    return messageUser.idToken
  }

  if (messageUser.authUserTokens && messageUser.authUserTokensSig) {
    return JSON.stringify({
      tabAuthUserTokens:  messageUser.authUserTokens,
      tabAuthUserTokensSig: messageUser.authUserTokensSig
    })
  }
  
  return 'unauthenticated'
}

exports.handler = async event => {
  const message = JSON.parse(get(event, 'Records[0].Sns.Message'))
  const graphqlMutationPayload = {
    query: `mutation LogSearchMutation($input: LogSearchInput!) {
        logSearch(input: $input) {
          success
        }
      }`,
    variables: {
      input: {
        causeId: message.data.causeId,
        searchEngineId: message.data.engine,
        version: 2,
        source: message.data.src,
      },
    },
    operationName: 'LogSearchMutation',
  }

  const response = await fetch(process.env.GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',

      // If the user does not have a token, send a placeholder value.
      // We do this because AWS API Gateway's custom authorizers will
      // reject any request without a token and we want to provide
      // unauthenticated access to our API.
      // "If a specified identify source is missing, null, or empty,
      // API Gateway returns a 401 Unauthorized response without calling
      // the authorizer Lambda function.”
      // https://docs.aws.amazon.com/apigateway/latest/developerguide/configure-api-gateway-lambda-authorization-with-console.html"
      Authorization: getAuthorizationHeaderFromMessage(message.user),
    },
    body: JSON.stringify(graphqlMutationPayload),
  })

  return response.json()
}

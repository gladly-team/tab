
import fetch from 'node-fetch'

const graphQLEndpoint = process.env.GRAPHQL_ENDPOINT || 'http://localhost:8080'

function fetchQuery (graphQLQueryStr, variablesObj, userIdToken) {
  // Add Authorization header if user has a token.
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
  if (userIdToken) {
    headers['Authorization'] = userIdToken
  }

  return fetch(graphQLEndpoint, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({
      query: graphQLQueryStr,
      variables: variablesObj
    })
  }).then(response => {
    return response.json()
  }).catch((err) => {
    console.log(err)
  })
}

export default fetchQuery

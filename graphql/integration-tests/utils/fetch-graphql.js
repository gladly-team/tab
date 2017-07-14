
import fetch from 'node-fetch'

const graphQLEndpoint = process.env.GRAPHQL_ENDPOINT || 'http://localhost:8080'

function fetchQuery (graphQLQueryStr, variablesObj) {
  return fetch(graphQLEndpoint, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: graphQLQueryStr,
      variables: variablesObj
    })
  }).then(response => {
    return response.json()
  })
}

export default fetchQuery

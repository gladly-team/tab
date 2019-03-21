import graphql from 'babel-plugin-relay/macro'
import commitMutation from 'relay-commit-mutation-promise'
import environment from 'js/relay-env'

const mutation = graphql`
  mutation LogSearchMutation($input: LogSearchInput!) {
    logSearch(input: $input) {
      user {
        id
        heartsUntilNextLevel
        level
        searches
        searchesToday
        vcCurrent
        vcAllTime
      }
    }
  }
`

export default input => {
  return commitMutation(environment, {
    mutation,
    variables: {
      input: input,
    },
  })
}

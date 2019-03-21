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

export default ({ userId }) => {
  return commitMutation(environment, {
    mutation,
    variables: {
      input: { userId },
    },
  })
}

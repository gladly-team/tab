import graphql from 'babel-plugin-relay/macro'
import commitMutation from 'relay-commit-mutation-promise'
import environment from 'js/relay-env'

const mutation = graphql`
  mutation SetUserCauseMutation($input: SetUserCauseInput!) {
    setUserCause(input: $input) {
      user {
        id
        cause {
          id
        }
      }
    }
  }
`

function commit(userId, causeId, onCompleted = () => {}, onError = () => {}) {
  return commitMutation(environment, {
    mutation,
    variables: {
      input: { userId, causeId },
    },
    onCompleted,
    onError,
  })
}

export default commit

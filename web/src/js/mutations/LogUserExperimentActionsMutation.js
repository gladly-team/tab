import graphql from 'babel-plugin-relay/macro'
import commitMutation from 'relay-commit-mutation-promise'
import environment from 'js/relay-env'

const mutation = graphql`
  mutation LogUserExperimentActionsMutation(
    $input: LogUserExperimentActionsInput!
  ) {
    logUserExperimentActions(input: $input) {
      user {
        id
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

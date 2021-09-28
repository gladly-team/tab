import graphql from 'babel-plugin-relay/macro'
import commitMutation from 'relay-commit-mutation-promise'
import environment from 'js/relay-env'

const mutation = graphql`
  mutation CreateVideoAdLogMutation($input: CreateVideoAdLogInput!) {
    createVideoAdLog(input: $input) {
      VideoAdLog {
        id
      }
    }
  }
`

export default userId => {
  return commitMutation(environment, {
    mutation,
    variables: {
      input: userId,
    },
  })
}

import graphql from 'babel-plugin-relay/macro'
import commitMutation from 'relay-commit-mutation-promise'
import environment from 'js/relay-env'

const mutation = graphql`
  mutation SetV4BetaMutation($input: SetV4BetaInput!) {
    setV4Beta(input: $input) {
      user {
        v4BetaEnabled
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

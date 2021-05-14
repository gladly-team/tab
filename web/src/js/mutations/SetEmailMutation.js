import graphql from 'babel-plugin-relay/macro'
import { commitMutation } from 'react-relay'

const mutation = graphql`
  mutation SetEmailMutation($input: SetEmailInput!) {
    setEmail(input: $input) {
      user {
        email
      }
    }
  }
`

function commit(
  environment,
  userId,
  email,
  onCompleted = () => {},
  onError = () => {}
) {
  return commitMutation(environment, {
    mutation,
    variables: {
      input: { userId, email },
    },
    onCompleted,
    onError,
  })
}

export default commit

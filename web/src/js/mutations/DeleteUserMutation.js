import graphql from 'babel-plugin-relay/macro'
import { commitMutation } from 'react-relay'

const mutation = graphql`
  mutation DeleteUserMutation($input: DeleteUserInput!) {
    deleteUser(input: $input) {
      success
    }
  }
`

function commit(
  environment,
  userId,
  onCompleted = () => {},
  onError = () => {}
) {
  return commitMutation(environment, {
    mutation,
    variables: {
      input: {
        userId,
      },
    },
    onCompleted: response => {
      onCompleted(response)
    },
    onError: err => {
      onError(err)
    },
  })
}

export default commit

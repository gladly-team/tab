import {
  commitMutation,
  graphql
} from 'react-relay'

const mutation = graphql`
  mutation SetUsernameMutation($input: SetUsernameInput!) {
    setUsername(input: $input) {
      user {
        username
      }
      errors {
        code
        message
      }
    }
  }
`

function commit (environment, userId, username,
  onCompleted = () => {}, onError = () => {}) {
  return commitMutation(
    environment,
    {
      mutation,
      variables: {
        input: { userId, username }
      },
      onCompleted,
      onError
    }
  )
}

export default commit

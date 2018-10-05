import {
  commitMutation,
  graphql
} from 'react-relay'

const mutation = graphql`
  mutation LogEmailVerifiedMutation($input: LogEmailVerifiedMutationInput!) {
    logEmailVerified(input: $input) {
      user {
        id
      }
    }
  }
`

function commit (environment, userId, onCompleted = () => {}, onError = () => {}) {
  return commitMutation(
    environment,
    {
      mutation,
      variables: {
        input: { userId }
      },
      onCompleted,
      onError
    }
  )
}

export default commit

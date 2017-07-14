import {
  commitMutation,
  graphql
} from 'react-relay/compat'

const mutation = graphql`
  mutation CreateNewUserMutation($input: CreateNewUserInput!) {
    createNewUser(input: $input) {
      user {
        id
        email
        username
      }
    }
  }
`

function commit (environment, userId, username, email, referralData, onCompleted, onError) {
  return commitMutation(
    environment,
    {
      mutation,
      variables: {
        input: { userId, username, email, referralData }
      },
      onCompleted: (response) => {
        onCompleted(response)
      },
      onError: (err) => {
        onError(err)
      }
    }
  )
}

export default {commit}

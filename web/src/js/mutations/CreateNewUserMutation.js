import graphql from 'babel-plugin-relay/macro'
import { commitMutation } from 'react-relay'

// TODO: fetch if the user is in the Tab v4 beta
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

function commit(
  environment,
  userId,
  email,
  referralData,
  experimentGroups,
  extensionInstallId,
  extensionInstallTimeApprox,
  onCompleted,
  onError
) {
  return commitMutation(environment, {
    mutation,
    variables: {
      input: {
        userId,
        email,
        referralData,
        experimentGroups,
        extensionInstallId,
        extensionInstallTimeApprox,
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

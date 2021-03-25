import graphql from 'babel-plugin-relay/macro'
import { commitMutation } from 'react-relay'

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
  v4BetaEnabled,
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
        v4BetaEnabled,
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

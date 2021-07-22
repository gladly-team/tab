import graphql from 'babel-plugin-relay/macro'
import commitMutation from 'relay-commit-mutation-promise'

const mutation = graphql`
  mutation UpdateMissionNotificationMutation(
    $input: UpdateMissionNotificationInput!
  ) {
    updateMissionNotification(input: $input) {
      success
    }
  }
`

function commit(
  environment,
  userId,
  missionId,
  onCompleted = () => {},
  onError = () => {}
) {
  return commitMutation(environment, {
    mutation,
    variables: {
      input: {
        userId,
        missionId,
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

import graphql from 'babel-plugin-relay/macro'
import commitMutation from 'relay-commit-mutation-promise'

const mutation = graphql`
  mutation SquadInviteResponseMutation($input: SquadInviteResponseInput!) {
    squadInviteResponse(input: $input) {
      success
    }
  }
`

function commit(
  environment,
  userId,
  missionId,
  accepted,
  onCompleted = () => {},
  onError = () => {}
) {
  return commitMutation(environment, {
    mutation,
    variables: {
      input: {
        userId,
        missionId,
        accepted,
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

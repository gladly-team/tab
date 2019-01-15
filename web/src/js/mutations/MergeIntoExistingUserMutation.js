import graphql from 'babel-plugin-relay/macro'
import { commitMutation } from 'react-relay'

const mutation = graphql`
  mutation MergeIntoExistingUserMutation($input: MergeIntoExistingUserInput!) {
    mergeIntoExistingUser(input: $input) {
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
      input: { userId },
    },
    onCompleted,
    onError,
  })
}

export default commit

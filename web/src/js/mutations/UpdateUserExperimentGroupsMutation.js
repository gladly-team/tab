import {
  commitMutation,
  graphql
} from 'react-relay'

const mutation = graphql`
  mutation UpdateUserExperimentGroupsMutation($input: UpdateUserExperimentGroupsInput!) {
    updateUserExperimentGroups(input: $input) {
      success
    }
  }
`

function commit (environment, { userId, experimentGroups }, onCompleted = () => {}, onError = () => {}) {
  return commitMutation(
    environment,
    {
      mutation,
      variables: {
        input: {
          userId,
          experimentGroups
        }
      },
      onCompleted,
      onError
    }
  )
}

export default commit

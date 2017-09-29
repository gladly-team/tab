import {
  commitMutation,
  graphql
} from 'react-relay/compat'

const mutation = graphql`
  mutation UpdateVcMutation($input: UpdateVcInput!) {
    updateVc(input: $input) {
      user {
        id
      }
    }
  }
`

function commit (environment, user) {
  const userId = user.id

  return commitMutation(
    environment,
    {
      mutation,
      variables: {
        input: { userId }
      }
    }
  )
}

export default {commit}

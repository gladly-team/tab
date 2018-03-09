import {
  commitMutation,
  graphql
} from 'react-relay/compat'

const mutation = graphql`
  mutation LogUserRevenueMutation($input: LogUserRevenueInput!) {
    logUserRevenue(input: $input) {
      success
    }
  }
`

function commit (environment, userId, revenue) {
  return commitMutation(
    environment,
    {
      mutation,
      variables: {
        input: { userId, revenue }
      }
    }
  )
}

export default commit

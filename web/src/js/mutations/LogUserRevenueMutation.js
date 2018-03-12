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

function commit (environment, userId, revenue, dfpAdvertiserId = null) {
  return commitMutation(
    environment,
    {
      mutation,
      variables: {
        input: { userId, revenue, dfpAdvertiserId }
      }
    }
  )
}

export default commit

import graphql from 'babel-plugin-relay/macro'
import {
  commitMutation
} from 'react-relay'

const mutation = graphql`
  mutation LogUserRevenueMutation($input: LogUserRevenueInput!) {
    logUserRevenue(input: $input) {
      success
    }
  }
`

function commit (environment, userId, revenue = null, dfpAdvertiserId = null,
  adSize = null, encodedRevenue = null, aggregationOperation = null, tabId = null,
  adUnitCode = null) {
  return commitMutation(
    environment,
    {
      mutation,
      variables: {
        input: {
          userId,
          revenue,
          dfpAdvertiserId,
          encodedRevenue,
          aggregationOperation,
          tabId,
          adSize,
          adUnitCode
        }
      }
    }
  )
}

export default commit

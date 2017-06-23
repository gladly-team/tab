import {
  commitMutation,
  graphql
} from 'react-relay/compat'

const mutation = graphql`
  mutation DonateVcMutation($input: DonateVcInput!) {
    donateVc(input: $input) {
      user {
        vcCurrent 
      }
    }
  }
`

function commit (environment, user, charityId, vc) {
  const userId = user.id

  return commitMutation(
    environment,
    {
      mutation,
      variables: {
        input: { userId, charityId, vc }
      }
    }
  )
}

export default {commit}

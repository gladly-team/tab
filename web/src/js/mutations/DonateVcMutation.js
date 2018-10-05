import {
  commitMutation,
  graphql
} from 'react-relay'

const mutation = graphql`
  mutation DonateVcMutation($input: DonateVcInput!) {
    donateVc(input: $input) {
      user {
        vcCurrent 
      }
    }
  }
`

function commit (environment, user, charityId, vc,
  onCompleted = () => {}, onError = () => {}) {
  const userId = user.id
  return commitMutation(
    environment,
    {
      mutation,
      variables: {
        input: { userId, charityId, vc }
      },
      onCompleted,
      onError
    }
  )
}

export default {commit}

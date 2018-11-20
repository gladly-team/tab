import {
  graphql
} from 'react-relay'
import commitMutation from 'relay-commit-mutation-promise'
import environment from 'js/relay-env'

const mutation = graphql`
  mutation DonateVcMutation($input: DonateVcInput!) {
    donateVc(input: $input) {
      user {
        vcCurrent 
      }
    }
  }
`

// Relay tool for mutations with promises:
// https://github.com/relay-tools/relay-commit-mutation-promise
// A good reference for mutation design:
// https://medium.com/entria/wrangling-the-client-store-with-the-relay-modern-updater-function-5c32149a71ac
export default (input, otherVars = {}) => {
  const { userId, charityId, vc } = input
  return commitMutation(
    environment,
    {
      mutation,
      variables: {
        input: {
          userId,
          charityId,
          vc
        }
      }
    }
  )
}

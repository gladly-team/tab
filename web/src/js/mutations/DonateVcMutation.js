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

// TODO: refactor
// args: inputVars obj, otherVars obj
// return a promise

// Relay tool for mutations with promises:
// https://github.com/relay-tools/relay-commit-mutation-promise
// A good reference for mutation design:
// https://medium.com/entria/wrangling-the-client-store-with-the-relay-modern-updater-function-5c32149a71ac
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

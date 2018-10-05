import {
  commitMutation,
  graphql
} from 'react-relay'

const mutation = graphql`
  mutation LogUserDataConsentMutation($input: LogUserDataConsentInput!) {
    logUserDataConsent(input: $input) {
      success
    }
  }
`

function commit (environment, userId, consentString, isGlobalConsent, onCompleted = () => {}) {
  return commitMutation(
    environment,
    {
      mutation,
      variables: {
        input: {
          userId,
          consentString,
          isGlobalConsent
        }
      },
      onCompleted
    }
  )
}

export default commit

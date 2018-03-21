import {
  commitMutation,
  graphql
} from 'react-relay/compat'

const mutation = graphql`
  mutation LogTabMutation($input: LogTabInput!) {
    logTab(input: $input) {
      user {
        id
        heartsUntilNextLevel
        level
        tabs
        vcCurrent
      }
    }
  }
`

function commit (environment, userId, tabId) {
  return commitMutation(
    environment,
    {
      mutation,
      variables: {
        input: { userId, tabId }
      }
    }
  )
}

export default {commit}

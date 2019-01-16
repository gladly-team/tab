import graphql from 'babel-plugin-relay/macro'
import { commitMutation } from 'react-relay'

const mutation = graphql`
  mutation LogTabMutation($input: LogTabInput!) {
    logTab(input: $input) {
      user {
        id
        heartsUntilNextLevel
        level
        tabs
        tabsToday
        vcCurrent
      }
    }
  }
`

function commit(environment, userId, tabId) {
  return commitMutation(environment, {
    mutation,
    variables: {
      input: { userId, tabId },
    },
  })
}

export default commit

import graphql from 'babel-plugin-relay/macro'
import commitMutation from 'relay-commit-mutation-promise'
import environment from 'js/relay-env'

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

export default input => {
  return commitMutation(environment, {
    mutation,
    variables: {
      input: input,
    },
  })
}

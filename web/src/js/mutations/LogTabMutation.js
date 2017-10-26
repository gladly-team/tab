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

function commit (environment, user) {
  const userId = user.id

  return commitMutation(
    environment,
    {
      mutation,
      variables: {
        input: { userId }
      }
    }
  )
}

export default {commit}

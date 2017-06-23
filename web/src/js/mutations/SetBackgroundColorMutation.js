import {
  commitMutation,
  graphql
} from 'react-relay/compat'

const mutation = graphql`
  mutation SetBackgroundColorMutation($input: SetUserBkgColorInput!) {
    setUserBkgColor(input: $input) {
      user {
        backgroundOption
        backgroundColor
      }
    }
  }
`

function commit (environment, user, color) {
  const userId = user.id

  return commitMutation(
    environment,
    {
      mutation,
      variables: {
        input: { userId, color }
      }
    }
  )
}

export default {commit}

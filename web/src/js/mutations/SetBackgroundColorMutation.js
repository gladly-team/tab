import graphql from 'babel-plugin-relay/macro'
import {
  commitMutation
} from 'react-relay'

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

function commit (environment, user, color,
  onCompleted = () => {}, onError = () => {}) {
  const userId = user.id

  return commitMutation(
    environment,
    {
      mutation,
      variables: {
        input: { userId, color }
      },
      onCompleted,
      onError
    }
  )
}

export default {commit}

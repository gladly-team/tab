import {
  commitMutation,
  graphql
} from 'react-relay/compat'

//
const mutation = graphql`
  mutation SetBackgroundDailyImageMutation($input: SetUserBkgDailyImageInput!) {
    setUserBkgDailyImage(input: $input) {
      user {
        backgroundOption
        backgroundImage {
          id
          imageURL
        }
      }
    }
  }
`

function commit (environment, user,
  onCompleted = () => {}, onError = () => {}) {
  const userId = user.id

  return commitMutation(
    environment,
    {
      mutation,
      variables: {
        input: { userId }
      },
      onCompleted,
      onError
    }
  )
}

export default {commit}

import {
  commitMutation,
  graphql
} from 'react-relay'

const mutation = graphql`
  mutation SetBackgroundCustomImageMutation($input: SetUserBkgCustomImageInput!) {
    setUserBkgCustomImage(input: $input) {
      user {
        backgroundOption
        customImage
      }
    }
  }
`

function commit (environment, user, image,
  onCompleted = () => {}, onError = () => {}) {
  const userId = user.id

  return commitMutation(
    environment,
    {
      mutation,
      variables: {
        input: { userId, image }
      },
      onCompleted,
      onError
    }
  )
}

export default {commit}

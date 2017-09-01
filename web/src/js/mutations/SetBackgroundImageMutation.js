import {
  commitMutation,
  graphql
} from 'react-relay/compat'

const mutation = graphql`
  mutation SetBackgroundImageMutation($input: SetUserBkgImageInput!) {
    setUserBkgImage(input: $input) {
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

function commit (environment, user, image,
  onCompleted = () => {}, onError = () => {}) {
  const userId = user.id
  const imageId = image.id

  return commitMutation(
    environment,
    {
      mutation,
      variables: {
        input: { userId, imageId }
      },
      onCompleted,
      onError
    }
  )
}

export default {commit}

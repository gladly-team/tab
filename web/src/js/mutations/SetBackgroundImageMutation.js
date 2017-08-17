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
          name
          image
          thumbnail
        }
      }
    }
  }
`

function commit (environment, user, image) {
  const userId = user.id
  const imageId = image.id

  return commitMutation(
    environment,
    {
      mutation,
      variables: {
        input: { userId, imageId }
      }
    }
  )
}

export default {commit}

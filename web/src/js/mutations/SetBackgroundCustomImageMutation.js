import {
  commitMutation,
  graphql
} from 'react-relay/compat'

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

function commit (environment, user, image) {
  const userId = user.id

  return commitMutation(
    environment,
    {
      mutation,
      variables: {
        input: { userId, image }
      }
    }
  )
}

export default {commit}

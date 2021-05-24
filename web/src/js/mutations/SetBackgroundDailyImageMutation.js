import graphql from 'babel-plugin-relay/macro'
import { commitMutation } from 'react-relay'

const mutation = graphql`
  mutation SetBackgroundDailyImageMutation($input: SetUserBkgDailyImageInput!) {
    setUserBkgDailyImage(input: $input) {
      user {
        backgroundOption
        backgroundImage {
          id
          imageURL
          timestamp
        }
      }
    }
  }
`

function commit(
  environment,
  userId,
  onCompleted = () => {},
  onError = () => {},
  category
) {
  return commitMutation(environment, {
    mutation,
    variables: {
      input: { userId, category },
    },
    onCompleted,
    onError,
  })
}

export default commit

import {
  commitMutation,
  graphql
} from 'react-relay/compat'

const mutation = graphql`
  mutation RemoveBookmarkMutation($input: RemoveBookmarkInput!) {
    removeBookmark(input: $input) {
      widget {
        data
      }
    }
  }
`

function commit (environment, user, widget, position) {
  const userId = user.id
  const widgetId = widget.id

  return commitMutation(
    environment,
    {
      mutation,
      variables: {
        input: { userId, widgetId, position }
      }
    }
  )
}

export default {commit}

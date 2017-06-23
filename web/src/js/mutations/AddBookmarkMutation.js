import {
  commitMutation,
  graphql
} from 'react-relay/compat'

const mutation = graphql`
  mutation AddBookmarkMutation($input: AddBookmarkInput!) {
    addBookmark(input: $input) {
      widget {
        data
      }
    }
  }
`

function commit (environment, user, widget, name, link) {
  const userId = user.id
  const widgetId = widget.id

  return commitMutation(
    environment,
    {
      mutation,
      variables: {
        input: { userId, widgetId, name, link }
      }
    }
  )
}

export default {commit}

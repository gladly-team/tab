import {
  commitMutation,
  graphql
} from 'react-relay/compat'

const mutation = graphql`
  mutation UpdateWidgetVisibilityMutation($input: UpdateWidgetVisibilityInput!) {
    updateWidgetVisibility(input: $input) {
      widget {
        visible
      }
    }
  }
`

function commit (environment, user, widget, visible,
  onCompleted = () => {}, onError = () => {}) {
  const userId = user.id
  const widgetId = widget.id

  return commitMutation(
    environment,
    {
      mutation,
      variables: {
        input: { userId, widgetId, visible }
      },
      onCompleted,
      onError
    }
  )
}

export default {commit}

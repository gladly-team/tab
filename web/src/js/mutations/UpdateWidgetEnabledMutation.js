import graphql from 'babel-plugin-relay/macro'
import {
  commitMutation
} from 'react-relay'

const mutation = graphql`
  mutation UpdateWidgetEnabledMutation($input: UpdateWidgetEnabledInput!) {
    updateWidgetEnabled(input: $input) {
      widget {
        enabled
      }
    }
  }
`

function commit (environment, user, widget, enabled,
  onCompleted = () => {}, onError = () => {}) {
  const userId = user.id
  const widgetId = widget.id

  return commitMutation(
    environment,
    {
      mutation,
      variables: {
        input: { userId, widgetId, enabled }
      },
      onCompleted,
      onError
    }
  )
}

export default {commit}

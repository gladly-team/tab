import {
  commitMutation,
  graphql
} from 'react-relay/compat'

const mutation = graphql`
  mutation UpdateWidgetDataMutation($input: UpdateWidgetDataInput!) {
    updateWidgetData(input: $input) {
      widget {
        data
      }
    }
  }
`

function commit (environment, user, widget, data,
  onCompleted = () => {}, onError = () => {}) {
  const userId = user.id
  const widgetId = widget.id

  return commitMutation(
    environment,
    {
      mutation,
      variables: {
        input: { userId, widgetId, data }
      },
      onCompleted,
      onError
    }
  )
}

export default {commit}

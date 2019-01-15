import graphql from 'babel-plugin-relay/macro'
import { commitMutation } from 'react-relay'

const mutation = graphql`
  mutation SetUserActiveWidgetMutation($input: SetUserActiveWidgetInput!) {
    setUserActiveWidget(input: $input) {
      user {
        activeWidget
      }
    }
  }
`

function commit(
  environment,
  user,
  widget,
  onCompleted = () => {},
  onError = () => {}
) {
  const userId = user.id
  const widgetId = widget.id

  return commitMutation(environment, {
    mutation,
    variables: {
      input: { userId, widgetId },
    },
    onCompleted,
    onError,
  })
}

export default { commit }

import {
  commitMutation,
  graphql,
} from 'react-relay/compat';

const mutation = graphql`
  mutation UpdateWidgetEnabledMutation($input: UpdateWidgetEnabledInput!) {
    updateWidgetEnabled(input: $input) {
      widget {
        enabled
      }
    }
  }
`;

function commit(environment, user, widget, enabled) {
  const userId = user.id;
  const widgetId = widget.id;

  return commitMutation(
    environment,
    {
      mutation,
      variables: {
        input: { userId, widgetId, enabled }
      }
    }
  );
}

export default {commit};


import {
  commitMutation,
  graphql,
} from 'react-relay/compat';

const mutation = graphql`
  mutation UpdateWidgetDataMutation($input: UpdateWidgetDataInput!) {
    updateWidgetData(input: $input) {
      widget {
        data
      }
    }
  }
`;

function commit(environment, user, widget, data) {
  const userId = user.id;
  const widgetId = widget.id;

  return commitMutation(
    environment,
    {
      mutation,
      variables: {
        input: { userId, widgetId, data }
      }
    }
  );
}

export default {commit};


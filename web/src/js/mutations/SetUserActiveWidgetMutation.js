import {
  commitMutation,
  graphql,
} from 'react-relay/compat';

const mutation = graphql`
  mutation SetUserActiveWidgetMutation($input: SetUserActiveWidgetInput!) {
    setUserActiveWidget(input: $input) {
      user {
        activeWidget
      }
    }
  }
`;

function commit(environment, user, widget) {
  const userId = user.id;
  const widgetId = widget.id;

  return commitMutation(
    environment,
    {
      mutation,
      variables: {
        input: { userId, widgetId }
      }
    }
  );
}

export default {commit};


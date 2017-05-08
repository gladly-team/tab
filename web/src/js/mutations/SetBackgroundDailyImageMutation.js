import {
  commitMutation,
  graphql,
} from 'react-relay/compat';

const mutation = graphql`
  mutation SetBackgroundDailyImageMutation($input: SetUserBkgDailyImageInput!) {
    setUserBkgDailyImage(input: $input) {
      user {
        backgroundOption
        backgroundImage {
          id
          name
          url
        }
      }
    }
  }
`;

function commit(environment, user) {
  const userId = user.id;

  return commitMutation(
    environment,
    {
      mutation,
      variables: {
        input: { userId }
      }
    }
  );
}

export default {commit};
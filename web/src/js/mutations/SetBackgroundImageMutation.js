import {
  commitMutation,
  graphql,
} from 'react-relay/compat';

const mutation = graphql`
  mutation SetBackgroundImageMutation($input: SetUserBkgImageInput!) {
    setUserBkgImage(input: $input) {
      user {
        backgroundImage {
          id
          name
          url
        }
      }
    }
  }
`;

function commit(environment, user, image) {
  const userId = user.id;
  const imageId = image.id;

  return commitMutation(
    environment,
    {
      mutation,
      variables: {
        input: { userId, imageId }
      }
    }
  );
}

export default {commit};
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

function getConfigs(userId) {
  return [{
    type: 'FIELDS_CHANGE',
    fieldIDs: {
      user: userId,
    }
  }];
}

function getOptimisticResponse(image) {
  return {
    user: {
      backgroundImage: {
        id: image.id,
        name: image.name,
        url: image.url
      }
    }
  };
}

function commit(environment, userId, image) {
  const imageId = image.id;
  return commitMutation(
    environment,
    {
      mutation,
      variables: {
        input: { userId, imageId }
      },
      configs: getConfigs(userId),
      optimisticResponse: () => getOptimisticResponse(image)
    }
  );
}

export default {commit};

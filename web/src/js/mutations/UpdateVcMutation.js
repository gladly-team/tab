import {
  commitMutation,
  graphql,
} from 'react-relay/compat';

const mutation = graphql`
  mutation UpdateVcMutation($input: UpdateVcInput!) {
    updateVc(input: $input) {
      user {
        id
        vcCurrent 
        vcAllTime
        heartsUntilNextLevel
        level
      }
    }
  }
`;

function getConfigs(user) {
  return [{
    type: 'FIELDS_CHANGE',
    fieldIDs: {
      user: user.id,
    }
  }];
}

function getOptimisticResponse(user) {
  return {
    user: {
      vcCurrent: user.vcCurrent + 1,
      vcAllTime: user.vcAllTime + 1
    }
  };
}

function commit(environment, user) {
  const userId = user.id;
  return commitMutation(
    environment,
    {
      mutation,
      variables: {
        input: { userId }
      },
      configs: getConfigs(user),
      optimisticResponse: () => getOptimisticResponse(user)
    }
  );
}

export default {commit};

import {
  commitMutation,
  graphql,
} from 'react-relay/compat';

const mutation = graphql`
  mutation DonateVcMutation($input: DonateVcInput!) {
    donateVc(input: $input) {
      user {
        vcCurrent 
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

function getOptimisticResponse(user, vc) {
  return {
    user: {
      vcCurrent: Math.max(user.vcCurrent - vc, 0),
    }
  };
}

function commit(environment, user, charityId, vc) {
  const userId = user.id;
  return commitMutation(
    environment,
    {
      mutation,
      variables: {
        input: { userId, charityId, vc }
      },
      configs: getConfigs(user),
      optimisticResponse: () => getOptimisticResponse(user, vc)
    }
  );
}

export default {commit};


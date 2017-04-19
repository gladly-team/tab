import Relay from 'react-relay';

class UpdateVcMutation extends Relay.Mutation {

  getMutation() {
    return Relay.QL`
      mutation { updateVc }
    `;
  }

  getVariables() {
    return {
      userId: this.props.userId,
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on UpdateVcPayload {
        user { 
          vcCurrent 
          vcAllTime
          heartsUntilNextLevel
          level
        }
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        user: this.props.userId,
      },
    }];
  }

  getOptimisticResponse() {
    return {
      user: {
        vcCurrent: this.props.vcCurrent + 1,
        vcAllTime: this.props.vcAllTime + 1,
      }
    };
  }
}

export default UpdateVcMutation;

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
        viewer { 
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
        viewer: this.props.viewer.id,
      },
    }];
  }

  getOptimisticResponse() {
    return {
      viewer: {
        vcCurrent: this.props.viewer.vcCurrent + 1,
        vcAllTime: this.props.viewer.vcAllTime + 1,
      }
    };
  }
}

export default UpdateVcMutation;

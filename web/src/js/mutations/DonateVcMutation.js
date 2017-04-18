import Relay from 'react-relay';

class DonateVcMutation extends Relay.Mutation {

  getMutation() {
    return Relay.QL`
      mutation { donateVc }
    `;
  }

  getVariables() {
    return {
      userId: this.props.viewer.id,
      charityId: this.props.charityId,
      vc: this.props.vcToDonate
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on DonateVcPayload {
        viewer { 
          vcCurrent
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
    const remainingVc = this.props.viewer.vcCurrent - this.props.vcToDonate;
    return {
      viewer: {
        vcCurrent: Math.max(remainingVc, 0),
      }
    };
  }
}

export default DonateVcMutation;

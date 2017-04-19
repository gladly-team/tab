import Relay from 'react-relay';

class DonateVcMutation extends Relay.Mutation {

  getMutation() {
    return Relay.QL`
      mutation { donateVc }
    `;
  }

  getVariables() {
    return {
      userId: this.props.userId,
      charityId: this.props.charityId,
      vc: this.props.vcToDonate
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on DonateVcPayload {
        user { 
          vcCurrent
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
    const remainingVc = this.props.vcCurrent - this.props.vcToDonate;
    return {
      user: {
        vcCurrent: Math.max(remainingVc, 0),
      }
    };
  }
}

export default DonateVcMutation;

import Relay from 'react-relay';

class SetBackgroundImageMutation extends Relay.Mutation {

  getMutation() {
    return Relay.QL`
      mutation { setUserBkgImage }
    `;
  }

  getVariables() {
    return {
      userId: this.props.viewer.id,
      imageId: this.props.imageId
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on SetUserBkgImagePayload {
        viewer { 
          backgroundImage {
            id
            name
            url
          }
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
}

export default SetBackgroundImageMutation;

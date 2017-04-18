import Relay from 'react-relay';

class SetBackgroundImageMutation extends Relay.Mutation {

  getMutation() {
    return Relay.QL`
      mutation { setUserBkgImage }
    `;
  }

  getVariables() {
    return {
      userId: this.props.userId,
      imageId: this.props.imageId
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on SetUserBkgImagePayload {
        user { 
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
        user: this.props.userId,
      },
    }];
  }
}

export default SetBackgroundImageMutation;

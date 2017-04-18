import Relay from 'react-relay';
import UserBackgroundImage from './UserBackgroundImageComponent';

export default Relay.createContainer(UserBackgroundImage, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        backgroundImage {
  	      id
  	      name
  	      url
  	    }
      }`
  }
});

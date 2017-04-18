import Relay from 'react-relay';
import UserDisplay from './UserDisplayComponent';

export default Relay.createContainer(UserDisplay, {
  fragments: {
    user: () => Relay.QL`
      fragment on User {
      	id
        username
        email
      }`
  }
});

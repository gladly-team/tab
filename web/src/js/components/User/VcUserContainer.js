import Relay from 'react-relay';
import VcUser from './VcUserComponent';

export default Relay.createContainer(VcUser, {
  fragments: {
    user: () => Relay.QL`
      fragment on User {
      	id
        vcCurrent
        vcAllTime
        level
        heartsUntilNextLevel 
      }`
  }
});

import Relay from 'react-relay';
import Dashboard from './DashboardComponent';
import VcUser from '../User/VcUserContainer';
import UserDisplay from '../User/UserDisplayContainer';

export default Relay.createContainer(Dashboard, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        ${VcUser.getFragment('viewer')}
        ${UserDisplay.getFragment('viewer')}
      }`
  }
});

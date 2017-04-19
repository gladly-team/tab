import Relay from 'react-relay';
import Dashboard from './DashboardComponent';
import VcUser from '../User/VcUserContainer';
import UserDisplay from '../User/UserDisplayContainer';
import UserBackgroundImage from '../User/UserBackgroundImageContainer';

export default Relay.createContainer(Dashboard, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Query {
        id
      }`,
    user: () => Relay.QL`
      fragment on User {
        ${UserBackgroundImage.getFragment('user')}
        ${VcUser.getFragment('user')}
        ${UserDisplay.getFragment('user')}
      }`
  }
});


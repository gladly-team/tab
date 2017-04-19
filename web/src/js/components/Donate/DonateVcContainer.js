import Relay from 'react-relay';
import DonateVc from './DonateVcComponent';

export default Relay.createContainer(DonateVc, {
  fragments: {
    user: () => Relay.QL`
      fragment on User {
      	id
      	vcCurrent
      }`,
    viewer: () => Relay.QL`
      fragment on Query {
        charities(first:20){
	      edges{
	        node{
	          id
	          name
	          category
	        }
	      }
	    }
      }`
  }
});

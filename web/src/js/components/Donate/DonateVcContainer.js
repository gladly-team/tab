import Relay from 'react-relay';
import DonateVc from './DonateVcComponent';

export default Relay.createContainer(DonateVc, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
      	id
      	vcCurrent
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

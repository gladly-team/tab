import Relay from 'react-relay';
import Charities from './CharitiesComponent';

export default Relay.createContainer(Charities, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
      	id
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

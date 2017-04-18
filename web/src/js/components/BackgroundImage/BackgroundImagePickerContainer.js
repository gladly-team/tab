import Relay from 'react-relay';
import BackgroundImagePicker from './BackgroundImagePickerComponent';

export default Relay.createContainer(BackgroundImagePicker, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
      	id
        backgroundImages(first:20){
	      edges{
	        node{
	          id
	          name
	          url
	        }
	      }
	    }
	    backgroundImage {
  	      id
  	      name
  	      url
  	    }
      }`
  }
});

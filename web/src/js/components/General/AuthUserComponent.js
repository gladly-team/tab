import React from 'react';
import FullScreenProgress from 'general/FullScreenProgress';
import { getCurrentUser } from '../../utils/cognito-auth';
import { goToLogin } from 'navigation/navigation';

class AuthUserComponent extends React.Component {
  
  constructor(props) {
  	super(props);
  	this.state = {
  		userId: null,
  	}
  }

  componentWillMount() {
  	getCurrentUser((user) => {
	    if (!user) {
	      goToLogin();
	      return;
	    }

	    this.setState({
	    	userId: user.sub,
	    });
	});
  }

  render() {
  	
  	if(!this.state.userId){
  		return (<FullScreenProgress />);
  	}

  	const root = {
      height: '100%',
      width: '100%',
    };

    const childrenWithProps = React.Children.map(this.props.children,
     (child) => React.cloneElement(child, {
     	variables: Object.assign({}, this.props.variables, { 
     		userId: this.state.userId 
     	})
     })
    );

    return (
      <div style={root}>
        {childrenWithProps}
      </div>
    );
  }
}

AuthUserComponent.propTypes = {
	variables: React.PropTypes.object,
}

AuthUserComponent.defaultProps = {
	variables: {}
}

export default AuthUserComponent;

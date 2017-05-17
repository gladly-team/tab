import React from 'react';
import Relay from 'react-relay';

import { goToDashboard } from 'navigation/navigation';

import Charities from './CharitiesContainer';
import AppBar from 'material-ui/AppBar';

class DonateVc extends React.Component {
  
  constructor(props) {
      super(props);
  }

  goToHome() {
    goToDashboard();
  }

  render() {
    const { user, app } = this.props;
    if(user.vcCurrent < 1) {
      return (<p>Not enough hearts to donate. :(</p>)
    }
    
    const main = {
      width: '100%',
      height: '100%',
    }

    return (
      <div style={main}>
        <AppBar
          title="Donate"
          iconClassNameLeft="fa fa-arrow-left"
          onLeftIconButtonTouchTap={this.goToHome.bind(this)}
        />
        <Charities app={app} user={user}/>
      </div>
    );
  }
}

DonateVc.propTypes = {
	app: React.PropTypes.object.isRequired,
  user: React.PropTypes.object.isRequired
};

export default DonateVc;



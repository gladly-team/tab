import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay';

import FadeInAnimation from 'general/FadeInAnimation';

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
      <FadeInAnimation>
        <div 
          key={'donate-view-key'}
          style={main}>
          <AppBar
            title="Donate"
            iconClassNameLeft="fa fa-arrow-left"
            onLeftIconButtonTouchTap={this.goToHome.bind(this)}
          />
          <Charities app={app} user={user}/>
        </div>
      </FadeInAnimation>
    );
  }
}

DonateVc.propTypes = {
	app: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};

export default DonateVc;



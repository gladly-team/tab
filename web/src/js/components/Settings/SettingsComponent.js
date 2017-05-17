import React from 'react';
import PropTypes from 'prop-types';
import { goTo, goToDashboard } from 'navigation/navigation';
import AppBar from 'material-ui/AppBar';
import FontIcon from 'material-ui/FontIcon';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Drawer from 'material-ui/Drawer';
import FlatButton from 'material-ui/FlatButton';

import WidgetsSettingsView from './Widgets/WidgetsSettingsView';
import BackgroundSettingsView from './Background/BackgroundSettingsView';

import { logoutUser } from '../../utils/cognito-auth';

class Settings extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    	selection: 'widgets',
    };
  }

  componentDidMount() {
     this.setState({
      selection: this.getRouteName(),
     })
  }

  getRouteName() {
    var currentPath = this.props.location.pathname;
    if(currentPath[currentPath.length - 1] == '/'){
      currentPath = currentPath.slice(0, currentPath.length - 1);
    }
    var index = currentPath.lastIndexOf('/');
    return currentPath.slice(index + 1);
  }

  openSettingsFor(selection) {
  	this.setState({
  		selection: selection,
  	});

    goTo('/app/settings/' + selection);
  }	

  goToHome() {
    goToDashboard();
  }

  logout() {
    logoutUser((loggedOut) => {
      if(loggedOut) {
        this.goToLogin();
      }
    });
  }

  goToLogin() {
    goTo('/auth');
  }
  
  render() {
    const { user } = this.props;

    const settings = {
      backgroundColor: '#F2F2F2',
      width: '100%',
      height: '100%',
    };

    const container = {
    	backgroundColor: '#F2F2F2',
    	width: '100vw',
    	display: 'flex',
    	justifyContent: 'center',
    }

    const defaultMenuItem = {
    };

    const widgets = Object.assign({}, defaultMenuItem, {
    	fontWeight: (this.state.selection == 'widgets' || 
        this.state.selection == 'settings')?'bold':'normal'
    });

    const background = Object.assign({}, defaultMenuItem, {
    	fontWeight: (this.state.selection == 'background')?'bold':'normal'
    });

    const logoutBtn = (
      <FlatButton
        onClick={this.logout.bind(this)} 
        label="Sign Out"
        labelPosition="before"
        icon={<FontIcon
              color={'#FFF'}
              className="fa fa-sign-out"/>}/>
    );

    return (
    	<div style={settings}>
          <AppBar
            title="Settings"
            iconClassNameLeft="fa fa-arrow-left"
            onLeftIconButtonTouchTap={this.goToHome.bind(this)}
            iconElementRight={logoutBtn}/>
          <Drawer>
            <AppBar 
              title="Settings" 
              iconClassNameLeft="fa fa-arrow-left"
              onLeftIconButtonTouchTap={this.goToHome.bind(this)}/>
            <MenuItem 
                style={widgets}
                onClick={this.openSettingsFor.bind(this, 'widgets')}>
                Widgets
            </MenuItem>
            <MenuItem 
              style={background}
              onClick={this.openSettingsFor.bind(this, 'background')}>Background</MenuItem>
          </Drawer>
	    	  <div style={container}>
	      		{this.props.children}
	      	</div>
      	</div>
    );
  }
}

Settings.propTypes = {
  user: PropTypes.object.isRequired
};

export default Settings;

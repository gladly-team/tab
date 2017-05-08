import React from 'react';
import { goTo } from 'navigation/navigation';

import AppBar from 'material-ui/AppBar';
import FontIcon from 'material-ui/FontIcon';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Drawer from 'material-ui/Drawer';

import WidgetsSettingsView from './Widgets/WidgetsSettingsView';
import BackgroundSettingsView from './Background/BackgroundSettingsView';

class Settings extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    	selection: 'background',
    };
  }

  openSettingsFor(selection) {
  	this.setState({
  		selection: selection,
  	});
  }	

  goToHome() {
    goTo('/');
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

    const profile = Object.assign({}, defaultMenuItem, {
    	fontWeight: (this.state.selection == 'profile')?'bold':'normal'
    });

    const general = Object.assign({}, defaultMenuItem, {
    	fontWeight: (this.state.selection == 'general')?'bold':'normal'
    });

    const widgets = Object.assign({}, defaultMenuItem, {
    	fontWeight: (this.state.selection == 'widgets')?'bold':'normal'
    });

    const background = Object.assign({}, defaultMenuItem, {
    	fontWeight: (this.state.selection == 'background')?'bold':'normal'
    });

    var settingView;
    switch(this.state.selection) {
    	case 'widgets':
    		settingView = (<WidgetsSettingsView />);
    		break;
      case 'background':
        settingView = (<BackgroundSettingsView />);
        break;
    	default:
    		break;
    }

    return (
    	<div style={settings}>
          <AppBar
            title="Settings"
            iconClassNameLeft="fa fa-arrow-left"
            onLeftIconButtonTouchTap={this.goToHome.bind(this)}
          />
          <Drawer>
            <AppBar 
              title="Settings" 
              iconClassNameLeft="fa fa-arrow-left"
              onLeftIconButtonTouchTap={this.goToHome.bind(this)}/>
            <MenuItem 
              style={profile}
              onClick={this.openSettingsFor.bind(this, 'profile')}>Profile</MenuItem>
            <MenuItem 
              style={general}
              onClick={this.openSettingsFor.bind(this, 'general')}>General</MenuItem>
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
	      		{settingView}
	      	</div>
      	</div>
    );
  }
}

Settings.propTypes = {
  user: React.PropTypes.object.isRequired
};

export default Settings;

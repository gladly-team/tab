/* eslint-disable jsx-a11y/href-no-hash */
import React from 'react';
import VcUser from '../User/VcUserContainer';
import UserDisplay from '../User/UserDisplayContainer';
import UserBackgroundImage from '../User/UserBackgroundImageContainer';
import BackgroundImagePickerContainer from '../BackgroundImage/BackgroundImagePickerContainer';
import DonateVcContainer from '../Donate/DonateVcContainer';

import Dialog from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

import {
	deepPurple500,
  grey300,
  grey50
} from 'material-ui/styles/colors';

class Dashboard extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      bkgSelectorOpened: false,
      donateDialogOpened: false
    };
  }

  changeBkgSelectorState(state) {
    this.setState({
      bkgSelectorOpened: state,
    });
  }

  changeDonateDialogState(state) {
    this.setState({
      donateDialogOpened: state,
    });
  }

  render() {

    const {app, user} = this.props;

    const content = {
      display: 'flex',
      height: '100vh',
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 'auto',
      backgroundColor: 'rgba(0,0,0,.6)',
      alignItems: 'center',
      justifyContent: 'center',
    }

    const greeting = {
      textAlign: 'center'
    };

    const subtitle = {
      color: 'white',
      fontSize: '2.5em',
      fontWeight: 'lighter',
    };

    const actioBtnContainer = {
      position: 'absolute',
      top: 10,
      left: 50,
      display: 'flex',
      width: 100,
      justifyContent: 'space-around'
    }

    const quote = {
      position: 'absolute',
      bottom: 10,
      color: 'white',
      textAlign: 'center',
      fontSize: '1em',
      fontWeight: 'normal',
      fontFamily: "'Comic Sans MS', cursive, sans-serif",
      width: 300,
      marginLeft: 'auto',
      marginRight: 'auto',
    }

    return (
      <div>
        <UserBackgroundImage user={user} />
        <div style={content}>
          <div style={greeting}>
            <UserDisplay user={user} />
            <VcUser user={user} />
            <h1 style={quote}>“Surf the web, save the world.”</h1>
          </div>
        </div>
        <div style={actioBtnContainer}>
          <IconButton 
            tooltip="Change background"
            onClick={this.changeBkgSelectorState.bind(this, true)}>
              <FontIcon
                color={grey300}
                hoverColor={'#FFF'}
                className="fa fa-picture-o fa-lg" />
          </IconButton>

          <IconButton 
            tooltip="Donate to a Charity"
            onClick={this.changeDonateDialogState.bind(this, true)}>
            <FontIcon 
              color={grey300}
              hoverColor={'#FFF'}
              className="fa fa-heart-o fa-lg" />
          </IconButton>
        </div>

        <Dialog
          title="Select a background image"
          open={this.state.bkgSelectorOpened}
          autoScrollBodyContent={true}
          onRequestClose={this.changeBkgSelectorState.bind(this, false)}>
            <BackgroundImagePickerContainer 
              app={app} 
              user={user}
              onImageSelected={this.changeBkgSelectorState.bind(this, false)}/>
        </Dialog>
        <Dialog
          title="Donate"
          open={this.state.donateDialogOpened}
          autoScrollBodyContent={true}
          onRequestClose={this.changeDonateDialogState.bind(this, false)}>
            <DonateVcContainer 
              app={app} 
              user={user}/>
        </Dialog>
      </div>
    );
  }
}

Dashboard.propTypes = {
  user: React.PropTypes.object.isRequired,
  app: React.PropTypes.object.isRequired
};

export default Dashboard;

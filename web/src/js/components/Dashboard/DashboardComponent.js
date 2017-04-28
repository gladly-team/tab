/* eslint-disable jsx-a11y/href-no-hash */
import React from 'react';
import VcUser from '../User/VcUserContainer';
import UserDisplay from '../User/UserDisplayContainer';
import UserBackgroundImage from '../User/UserBackgroundImageContainer';
import BackgroundImagePickerView from '../BackgroundImage/BackgroundImagePickerView';
import DonateVcView from '../Donate/DonateVcView';
import WidgetsView from '../Widget/WidgetsView';

import { FormattedMessage } from 'react-intl';

import Dialog from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

import {
  grey300,
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

    const { user } = this.props;

    const content = {
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
    }

    const subtitle = {
      color: 'white',
      fontSize: '2.5em',
      fontWeight: 'lighter',
    };

    const actioBtnContainer = {
      position: 'absolute',
      bottom: 10,
      right: 50,
      display: 'flex',
      width: 100,
      justifyContent: 'space-around'
    }

    const quote = {
      position: 'absolute',
      bottom: 10,
      left: 40,
      color: 'white',
      fontSize: '1em',
      fontWeight: 'normal',
      fontFamily: "'Comic Sans MS', cursive, sans-serif",
      width: 300,
      marginLeft: 'auto',
      marginRight: 'auto',
    }

    // <UserDisplay user={user} />

    return (
      <div>
        <UserBackgroundImage user={user} />
        <div style={content}>
          <VcUser user={user} />
          <h1 style={quote}>
            <FormattedMessage
              id={'app.quote'}
              defaultMessage={ '“Surf the web, save the world.”' }/>
          </h1>
        </div>
        <WidgetsView />
        <div style={actioBtnContainer}>
          <IconButton 
            tooltip="Change background"
            tooltipPosition="top-center"
            onClick={this.changeBkgSelectorState.bind(this, true)}>
              <FontIcon
                color={grey300}
                hoverColor={'#FFF'}
                className="fa fa-picture-o fa-lg" />
          </IconButton>
          <IconButton 
            tooltip="Donate to a Charity"
            tooltipPosition="top-center"
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
            <BackgroundImagePickerView
              onImageSelected={this.changeBkgSelectorState.bind(this, false)}/>
        </Dialog>
        <Dialog
          title="Donate"
          open={this.state.donateDialogOpened}
          autoScrollBodyContent={true}
          onRequestClose={this.changeDonateDialogState.bind(this, false)}>
            <DonateVcView />
        </Dialog>
      </div>
    );
  }
}

Dashboard.propTypes = {
  user: React.PropTypes.object.isRequired
};

export default Dashboard;

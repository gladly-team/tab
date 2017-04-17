/* eslint-disable jsx-a11y/href-no-hash */
import React from 'react';
import VcUser from '../User/VcUserContainer';
import UserDisplay from '../User/UserDisplayContainer';
import UserBackgroundImage from '../User/UserBackgroundImageContainer';
import yeoman from '../../assets/yeoman.png';

import {
	deepPurple500
} from 'material-ui/styles/colors';

class Dashboard extends React.Component {
  
  static propTypes = {
    viewer: React.PropTypes.object.isRequired
  };

  render() {

    const {viewer} = this.props;

    const content = {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 'auto',
      backgroundColor: 'rgba(0,0,0,.4)'
    }

    const greeting = {
      color: 'white',
      height: 330,
      paddingTop: 50,
      textAlign: 'center'
    };

    const subtitle = {
      fontSize: '3em',
      fontWeight: 'bold',
    };

    return (
      <div>
        <UserBackgroundImage viewer={viewer} />
        <div style={content}>
          <div style={greeting}>
            <UserDisplay viewer={viewer} />
            <h1 style={subtitle}>Surf the web, save the world.</h1>
          </div>
         <VcUser viewer={viewer} />
        </div>
      </div>
    );
  }
}

export default Dashboard;

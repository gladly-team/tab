/* eslint-disable jsx-a11y/href-no-hash */
import React from 'react';
import VcUser from '../User/VcUserContainer';
import UserDisplay from '../User/UserDisplayContainer';
import yeoman from '../../assets/yeoman.png';

import {
	deepPurple500
} from 'material-ui/styles/colors';

class Dashboard extends React.Component {
  
  static propTypes = {
    viewer: React.PropTypes.object.isRequired
  };

  render() {
  	const root = {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      backgroundColor: deepPurple500,
    };

    const greeting = {
      color: 'white',
      height: 330,
      paddingTop: 50,
      textAlign: 'center',
    };

    return (
      <div style={root}>
        <div style={greeting}>
          <UserDisplay viewer={this.props.viewer} />
          <p>Surf the web, save the world.</p>
          <img src={yeoman} alt='yeoman' />
        </div>
        <VcUser viewer={this.props.viewer} />
      </div>
    );
  }
}

export default Dashboard;

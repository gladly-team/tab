import React from 'react';
import VcUser from '../User/VcUserContainer';
import yeoman from '../../assets/yeoman.png';

export default class App extends React.Component {
  static propTypes = {
    children: React.PropTypes.object.isRequired,
    viewer: React.PropTypes.object.isRequired
  };

  render() {
    
    const root = {
      height: '100vh',
    };

    return (
      <div style={root}>
        {this.props.children}
      </div>
    );
  }
}

import React from 'react';
import Relay from 'react-relay';
import 'normalize.css/normalize.css';
import 'react-mdl/extra/css/material.cyan-red.min.css';
import UpdateVcMutation from './UpdateVcMutation';

class VcUser extends React.Component {
  static propTypes = {
    viewer: React.PropTypes.object.isRequired
  };

  componentDidMount() {
    const updateVcMutation = new UpdateVcMutation({ viewer: this.props.viewer });
    Relay.Store.commitUpdate(updateVcMutation);
  }

  render() {

    const container = {
      position: 'fixed',
      bottom: 0,
      left: 0,
      background: 'black',
      width: 300,
      height: 300,
    };

    const text = {
      color: 'white',
      textAlign: 'center',
    }

    return (
      <div style={container}>
        <h1 style={text}>{this.props.viewer.vcCurrent}</h1>
      </div>
    );
  }
}

export default VcUser;
import React from 'react';

export default class App extends React.Component {
  // static propTypes = {
  //   children: React.PropTypes.object.isRequired,
  //   viewer: React.PropTypes.object.isRequired
  // };

  render() {
    
    const root = {
      height: '100vh',
    };

    return (
      <div style={root}>
        <h1>{this.props.viewer.username}</h1>
      </div>
    );
  }
}

// <div style={root}>
//   {this.props.children}
// </div>
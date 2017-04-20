import React from 'react';

class App extends React.Component {
  // static propTypes = {
  //   children: React.PropTypes.object.isRequired,
  //   viewer: React.PropTypes.object.isRequired
  // };

  render() {

    const { viewer } = this.props;
     
    const root = {
      height: '100vh',
    };

    return (
      <div style={root}>
        <h1>From viewer:</h1>
        <h2>{viewer.username}({viewer.email})({viewer.level})</h2>
        <h1>From user:</h1>
        <h2>{viewer.username}({viewer.email})({viewer.level})</h2>
      </div>
    );
  }
}

App.propTypes = {
  // children: React.PropTypes.object.isRequired,
  viewer: React.PropTypes.object.isRequired,
  user: React.PropTypes.object.isRequired
};

export default App;

// <div style={root}>
//   {this.props.children}
// </div>
import React from 'react';

class App extends React.Component {

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

export default App;


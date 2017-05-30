import React from 'react';

class BaseContainer extends React.Component {

  render() {
    const root = {
      width: '100vw',
      height: '100vh',
    };

    return (
      <div style={root}>
        {this.props.children}
      </div>
    );
  }
}

export default BaseContainer;


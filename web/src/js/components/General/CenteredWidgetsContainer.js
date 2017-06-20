import React from 'react';

class CenteredWidgetsContainer extends React.Component {

  render() {
    const root = {
      textAlign: 'center',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100%',
    };

    return (
      <div style={root}>
          {this.props.children}
      </div>
    );
  }
}

export default CenteredWidgetsContainer;


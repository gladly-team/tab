import React from 'react';
import PropTypes from 'prop-types';

class WidgetSharedSpace extends React.Component {
  
  constructor(props) {
  	super(props);
  }

  render() {
    const main = {
      position: 'absolute',
      top: 50,
      left: 20,
      backgroundColor: 'transparent',
      width: 300,
    }

    return (
      <div style={main}>
        {this.props.children}
      </div>
    );
  }
}

WidgetSharedSpace.propTypes = {
}

WidgetSharedSpace.defaultProps = {
}

export default WidgetSharedSpace;

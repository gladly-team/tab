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
      height: '80vh',
      overflowX: 'hidden',
      overflowY: 'scroll',
    }

    return (
      <div style={Object.assign({}, main, this.props.containerStyle)}>
        {this.props.children}
      </div>
    );
  }
}

WidgetSharedSpace.propTypes = {
  containerStyle: PropTypes.object,
}

WidgetSharedSpace.defaultProps = {
  containerStyle: {}
}

export default WidgetSharedSpace;

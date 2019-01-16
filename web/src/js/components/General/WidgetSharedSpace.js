import React from 'react'
import PropTypes from 'prop-types'

class WidgetSharedSpace extends React.Component {
  render() {
    const main = {
      position: 'absolute',
      zIndex: 1,
      top: 40,
      left: 5,
      backgroundColor: 'transparent',
      width: 300,
      overflowX: 'hidden',
      overflowY: 'hidden',
    }

    return (
      <div style={Object.assign({}, main, this.props.containerStyle)}>
        {this.props.children}
      </div>
    )
  }
}

WidgetSharedSpace.propTypes = {
  containerStyle: PropTypes.object,
}

WidgetSharedSpace.defaultProps = {
  containerStyle: {},
}

export default WidgetSharedSpace

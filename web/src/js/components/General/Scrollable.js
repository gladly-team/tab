import React from 'react'
import PropTypes from 'prop-types'
import { Scrollbars } from 'react-custom-scrollbars'

class Scrollable extends React.Component {
  render () {
    return (
      <Scrollbars
        style={Object.assign({}, {
          display: 'block',
          padding: 0,
          margin: 0,
          height: 200
        }, this.props.style)}
        {...this.props}
      >
        {this.props.children}
      </Scrollbars>
    )
  }
}

Scrollable.propTypes = {
  style: PropTypes.object
}

Scrollable.defaultProps = {
  style: {}
}

export default Scrollable

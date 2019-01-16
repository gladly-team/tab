import React from 'react'
import PropTypes from 'prop-types'
import { Scrollbars } from 'react-custom-scrollbars'

class Scrollable extends React.Component {
  render() {
    // Must either set a height or set autoHeight=true.
    // https://github.com/malte-wessel/react-custom-scrollbars
    return (
      <Scrollbars
        style={Object.assign(
          {},
          {
            display: 'block',
            padding: 0,
            margin: 0,
            height: 200,
          },
          this.props.style
        )}
        {...this.props}
      >
        {this.props.children}
      </Scrollbars>
    )
  }
}

Scrollable.propTypes = {
  style: PropTypes.object,
}

Scrollable.defaultProps = {
  style: {},
}

export default Scrollable

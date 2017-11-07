import React from 'react'
import PropTypes from 'prop-types'
import Scrollable from 'general/Scrollable'

class WidgetScrollSection extends React.Component {
  render () {
    return (
      <Scrollable
        style={{
          height: '60vh'
        }}
      >
        {this.props.children}
      </Scrollable>
    )
  }
}

WidgetScrollSection.propTypes = {
  style: PropTypes.object
}

WidgetScrollSection.defaultProps = {
  style: {}
}

export default WidgetScrollSection

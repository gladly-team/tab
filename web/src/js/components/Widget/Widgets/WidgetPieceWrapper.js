import React from 'react'
// import PropTypes from 'prop-types'

class WidgetPieceWrapper extends React.Component {
  render() {
    return <span>{this.props.children}</span>
  }
}

WidgetPieceWrapper.propTypes = {}

WidgetPieceWrapper.defaultProps = {}

export default WidgetPieceWrapper

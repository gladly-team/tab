import React from 'react'
import PropTypes from 'prop-types'
import Scrollable from 'js/components/General/Scrollable'

const renderView = ({ style, ...props }) => {
  const viewStyle = {
    paddingRight: 8,
  }
  return <div style={{ ...style, ...viewStyle }} {...props} />
}

class WidgetScrollSection extends React.Component {
  render() {
    return (
      <Scrollable
        style={{
          height: '60vh',
          paddingRight: 6,
          overflowX: 'hidden',
        }}
        renderView={renderView}
      >
        {this.props.children}
      </Scrollable>
    )
  }
}

WidgetScrollSection.propTypes = {
  style: PropTypes.object,
}

WidgetScrollSection.defaultProps = {
  style: {},
}

export default WidgetScrollSection


import React from 'react'
import PropTypes from 'prop-types'
import CircularProgress from 'material-ui/CircularProgress'

class FullScreenProgress extends React.Component {
  render () {
    const {containerStyle, progressStyle} = this.props

    return (
      <div
        style={containerStyle}>
        <CircularProgress
          {...progressStyle} />
      </div>)
  }
}

FullScreenProgress.propTypes = {
  containerStyle: PropTypes.object,
  progressStyle: PropTypes.object
}

FullScreenProgress.defaultProps = {
  containerStyle: {
    width: '100vw',
    height: '100vh',
    maxWidth: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },

  progressStyle: {
    size: 60,
    thickness: 7
  }
}

export default FullScreenProgress

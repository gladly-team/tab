import React from 'react'
import PropTypes from 'prop-types'
import CircularProgress from 'material-ui/CircularProgress'

class ProgressLoader extends React.Component {
  render() {
    const { progressProps } = this.props

    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          minHeight: 'inherit',
          boxSizing: 'border-box',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress {...progressProps} />
      </div>
    )
  }
}

ProgressLoader.propTypes = {
  progressProps: PropTypes.object,
}

ProgressLoader.defaultProps = {
  progressProps: {
    size: 60,
    thickness: 7,
  },
}

export default ProgressLoader

import React from 'react'
import PropTypes from 'prop-types'
import Snackbar from '@material-ui/core/Snackbar'

const ErrorMessage = props => {
  const { message, open, style, ...otherProps } = props
  if (!message) {
    return null
  }
  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      style={style}
      data-test-id={'error-message'}
      autoHideDuration={4000}
      {...otherProps}
      message={message}
      open={open}
    />
  )
}

ErrorMessage.propTypes = {
  message: PropTypes.string,
  open: PropTypes.bool.isRequired,
  style: PropTypes.object,
}

ErrorMessage.defaultProps = {
  message: null,
  open: true,
  style: {},
}

export default ErrorMessage


import React from 'react'
import PropTypes from 'prop-types'
import Snackbar from 'material-ui/Snackbar'

class ErrorMessage extends React.Component {
  render () {
    const { message } = this.props
    // TODO: set theme color.
    return (
      <Snackbar
        contentStyle={{textAlign: 'center'}}
        {...this.props}
        data-test-id={'error-message'}
        message={message}
        open
        autoHideDuration={4000}
      />
    )
  }
}

ErrorMessage.propTypes = {
  message: PropTypes.string,
  style: PropTypes.object
}

ErrorMessage.defaultProps = {
  message: null,
  style: {}
}

export default ErrorMessage

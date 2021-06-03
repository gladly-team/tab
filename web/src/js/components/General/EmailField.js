import React from 'react'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'

class EmailField extends React.Component {
  constructor(props) {
    super(props)
    this.inputElem = null
    this.state = {
      email: null,
      validationErrorMessage: null,
    }
  }

  hasValue() {
    return !!(
      this.inputElem &&
      this.inputElem.value &&
      this.inputElem.value.trim()
    )
  }

  getValue() {
    if (this.hasValue()) {
      return this.inputElem.value.trim()
    }
    return null
  }

  setErrorMessage(message) {
    this.setState({
      validationErrorMessage: message,
    })
  }

  validate() {
    if (this.hasValue()) {
      return true
    }
  }

  render() {
    const {
      emailDuplicate,
      emailInvalid,
      otherError,
      ...otherProps
    } = this.props
    const { validationErrorMessage } = this.state
    const errMessage = emailDuplicate
      ? 'Email is already taken. Please choose another.'
      : emailInvalid
      ? 'Email is invalid.'
      : otherError
      ? 'There was an error saving your email. Please try again later.'
      : validationErrorMessage
    return (
      <TextField
        id={'email-input'}
        data-test-id={'email-field-text-input'}
        inputRef={input => {
          this.inputElem = input
        }}
        {...otherProps}
        error={!!errMessage}
        helperText={errMessage}
      />
    )
  }
}

EmailField.propTypes = {
  emailDuplicate: PropTypes.bool,
  otherError: PropTypes.bool,
}

EmailField.defaultProps = {
  emailDuplicate: false,
  otherError: false,
}

export default EmailField

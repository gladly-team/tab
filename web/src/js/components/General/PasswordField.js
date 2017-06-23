import React from 'react'
import TextField from 'material-ui/TextField'

import {validatePassword} from 'web-utils'

class PasswordField extends React.Component {
  constructor (props) {
    super(props)
    this.password = null
    this.state = {
      password: null,
      error: null
    }

    this.config = {
      lowercase: true,
      uppercase: true,
      numeric: true,
      special: false,
      minSize: 8
    }

    this.errorCodes = {
      lowercase: 'At least one lowercase letter.',
      uppercase: 'At least one uppercase letter.',
      numeric: 'At least one number.',
      special: 'At least one special character.',
      minSize: 'Should be at least ' + this.config.minSize + ' characters long.'
    }
  }

  hasValue () {
    return this.password.input &&
      this.password.input.value &&
      this.password.input.value.trim()
  }

  getValue () {
    if (this.hasValue) {
      return this.password.input.value.trim()
    }
    return null
  }

  validate () {
    if (this.hasValue()) {
      const password = this.password.input.value.trim()
      const validate = validatePassword(password, this.config)
      if (!validate.valid) {
        this.setState({
          error: this.getError(validate, this.config)
        })
      } else {
        this.setState({
          error: null
        })
      }
      return validate.valid
    }
    return false
  }

  getError (validate, config) {
    var error = ''
    for (var prop in config) {
      if (config[prop] && !validate[prop]) {
        error += this.errorCodes[prop] + ' '
      }
    }
    return error
  }

  render () {
    return (
      <TextField
        ref={(input) => { this.password = input }}
        {...this.props}
        type={'password'}
        errorText={this.state.error} />
    )
  }
}

export default PasswordField

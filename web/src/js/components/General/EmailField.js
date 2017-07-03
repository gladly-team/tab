import React from 'react'
import PropTypes from 'prop-types'
import TextField from 'material-ui/TextField'

import {validateEmail} from 'web-utils'

class EmailField extends React.Component {
  constructor (props) {
    super(props)
    this.email = null
    this.state = {
      error: null
    }

    this.errorMsg = 'Invalid email address.'
  }

  hasValue () {
    return this.email.input &&
      this.email.input.value &&
      this.email.input.value.trim()
  }

  getValue () {
    if (this.hasValue) {
      return this.email.input.value.trim()
    }
    return null
  }

  validate () {
    const email = this.getValue()
    if (email) {
      const isValid = validateEmail(email)
      if (!isValid) {
        this.setState({
          error: this.errorMsg
        })
      } else {
        this.setState({
          error: null
        })
      }
      return isValid
    }

    this.setState({
      error: null
    })
    return false
  }

  render () {
    const props = Object.assign({}, this.props)
    delete props['inputId']

    return (
      <TextField
        id={this.props.inputId}
        ref={(input) => { this.email = input }}
        {...props}
        errorText={this.state.error} />
    )
  }
}

EmailField.propTypes = {
  inputId: PropTypes.string.isRequired
}

export default EmailField

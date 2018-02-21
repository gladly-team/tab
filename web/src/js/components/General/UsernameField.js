import React from 'react'
import PropTypes from 'prop-types'
import TextField from 'material-ui/TextField'

import { validateUsername } from 'web-utils'

class UsernameField extends React.Component {
  constructor (props) {
    super(props)
    this.username = null
    this.state = {
      username: null,
      error: null
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.usernameDuplicate) {
      this.setErrorMessage('Username is already taken. Please choose another.')
    } else if (nextProps.otherError) {
      this.setErrorMessage('There was an error saving your username. Please try again later.')
    }
  }

  hasValue () {
    return this.username.input &&
      this.username.input.value &&
      this.username.input.value.trim()
  }

  getValue () {
    if (this.hasValue) {
      return this.username.input.value.trim()
    }
    return null
  }

  setErrorMessage (message) {
    this.setState({
      error: message
    })
  }

  validate () {
    if (this.hasValue()) {
      const username = this.username.input.value.trim()
      const isValid = validateUsername(username)
      if (!isValid) {
        if (username.length < 2) {
          this.setErrorMessage('Must be at least two characters.')
        } else {
          this.setErrorMessage('Username is invalid.')
        }
      } else {
        this.setErrorMessage(null)
      }
      return isValid
    } else {
      this.setErrorMessage('Must be at least two characters.')
      return false
    }
  }

  render () {
    const props = Object.assign({}, this.props)
    delete props['usernameDuplicate']
    delete props['otherError']

    return (
      <TextField
        id={'username-input'}
        data-test-id={'username-field-text-input'}
        ref={(input) => { this.username = input }}
        floatingLabelText={<span>Username</span>}
        {...props}
        errorText={this.state.error} />
    )
  }
}

UsernameField.propTypes = {
  usernameDuplicate: PropTypes.bool,
  otherError: PropTypes.bool
}

UsernameField.defaultProps = {
  usernameDuplicate: false,
  otherError: false
}

export default UsernameField

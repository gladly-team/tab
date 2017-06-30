import React from 'react'
import PropTypes from 'prop-types'
import EmailField from 'general/EmailField'
import { goToRetrievePassword } from 'navigation/navigation'
import CircleButton from 'general/CircleButton'

import appTheme from 'theme/default'

class EmailForm extends React.Component {
  constructor (props) {
    super(props)
    this.email = null
  }

  _handleKeyPress (e) {
    if (e.key === 'Enter') {
      this.handleSubmit()
    }
  }

  handleSubmit () {
    if (this.email.validate()) {
      const email = this.email.getValue()
      this.props.onResponse(email)
    }
  }

  retrievePassword () {
    goToRetrievePassword()
  }

  render () {
    const main = {
      backgroundColor: appTheme.palette.primary1Color,
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }

    const container = {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }

    const floatingLabelStyle = {
      color: '#FFF'
    }

    const inputStyle = {
      color: '#FFF'
    }

    const underlineStyle = {
      borderColor: appTheme.palette.borderColor
    }

    const underlineFocusStyle = {
      borderColor: appTheme.palette.alternateTextColor
    }

    const retrievePasswordContainer = {
      marginTop: 20,
      width: 256,
      textAlign: 'center'
    }

    const retrievePasswordLink = {
      color: '#FFF',
      cursor: 'pointer',
      fontSize: 14
    }

    return (
      <div
        data-test-id={'email-form-test-id'}
        style={main}>
        <div
          data-test-id={'email-input-container'}
          style={container}>
          <EmailField
            inputId={'login-email-input-id'}
            ref={(input) => { this.email = input }}
            onKeyPress={this._handleKeyPress.bind(this)}
            floatingLabelText='Email'
            defaultValue={this.props.email}
            floatingLabelStyle={floatingLabelStyle}
            underlineStyle={underlineStyle}
            underlineFocusStyle={underlineFocusStyle}
            inputStyle={inputStyle} />
          <CircleButton
            buttonId={'confirm-email-btn-id'}
            size={40}
            onClick={this.handleSubmit.bind(this)} />
        </div>

        <div style={retrievePasswordContainer}>
          <span
            style={retrievePasswordLink}
            onClick={this.retrievePassword.bind(this)}>Forgot your password?</span>
        </div>
      </div>
    )
  }
}

EmailForm.propTypes = {
  email: PropTypes.string,
  onResponse: PropTypes.func.isRequired
}

EmailForm.defaultProps = {
  email: ''
}

export default EmailForm

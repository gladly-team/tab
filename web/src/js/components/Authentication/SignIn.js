import React from 'react'
import {
  goToDashboard,
  goToRetrievePassword
} from 'navigation/navigation'
import AuthActionButtom from 'general/AuthActionButtom'
import ErrorMessage from 'general/ErrorMessage'
import UsernameField from 'general/UsernameField'
import PasswordField from 'general/PasswordField'
import { login } from '../../utils/cognito-auth'
import appTheme, { appBarLightColor } from 'theme/default'

class SignIn extends React.Component {
  constructor (props) {
    super(props)
    this.password = null

    this.state = {
      loggingUser: false,
      errorMessage: null
    }
  }

  _handleKeyPress (e) {
    if (e.key === 'Enter') {
      this.handleSubmit()
    }
  }

  handleSubmit () {
    const passwordValid = this.password.validate()
    const usernameValid = this.username.validate()
    if (passwordValid && usernameValid) {
      const password = this.password.getValue()
      const username = this.username.getValue()
      this.logUserIn(username, password,
        () => {
          goToDashboard()
        },
        (err) => {
          this.showError(err.message)
        })
    }
  }

  logUserIn (username, password, success, failure) {
    this.setState({
      loggingUser: true
    })

    login(username, password, (res) => {
      this.setState({
        loggingUser: false
      })
      success()
    }, (err) => {
      this.setState({
        loggingUser: false
      })
      if (failure) { failure(err) }
    })
  }

  showError (msg) {
    this.setState({
      errorMessage: msg
    })
  }

  clearError () {
    this.showError(null)
  }

  retrievePassword () {
    goToRetrievePassword()
  }

  render () {
    const main = {
    }

    const container = {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column'
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
      alignSelf: 'flex-start',
      marginRight: 10
    }

    const retrievePasswordLink = {
      color: appBarLightColor,
      cursor: 'pointer',
      fontSize: 11
    }

    const actions = {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      marginTop: 8
    }

    return (
      <div
        data-test-id={'login-form-container-test-id'}
        style={main}>
        <div style={container}>
          <UsernameField
            inputId={'login-username-input-id'}
            ref={(input) => { this.username = input }}
            onKeyPress={this._handleKeyPress.bind(this)}
            floatingLabelText='Username or email'
            floatingLabelStyle={floatingLabelStyle}
            underlineStyle={underlineStyle}
            underlineFocusStyle={underlineFocusStyle}
            inputStyle={inputStyle} />
          <PasswordField
            inputId={'login-password-input-id'}
            ref={(input) => { this.password = input }}
            onKeyPress={this._handleKeyPress.bind(this)}
            floatingLabelText='Password'
            floatingLabelStyle={floatingLabelStyle}
            underlineStyle={underlineStyle}
            underlineFocusStyle={underlineFocusStyle}
            type={'password'}
            inputStyle={inputStyle} />

          <div style={actions}>
            <div style={retrievePasswordContainer}>
              <span
                style={retrievePasswordLink}
                onClick={this.retrievePassword.bind(this)}>Forgot your password?</span>
            </div>
            <AuthActionButtom
              btnId={'login-action-btn-id'}
              label={'LOG IN'}
              containerStyle={{ marginTop: 24 }}
              loading={this.state.loggingUser}
              onClicked={this.handleSubmit.bind(this)} />
          </div>

        </div>
        { this.state.errorMessage
          ? (<ErrorMessage
            message={this.state.errorMessage}
            onRequestClose={this.clearError.bind(this)} />)
          : null }
      </div>
    )
  }
}

export default SignIn

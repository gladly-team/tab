import React from 'react'
import {
  goToDashboard,
  goToRetrievePassword
} from 'navigation/navigation'
import AuthActionButtom from 'general/AuthActionButtom'
import UsernameField from 'general/UsernameField'
import PasswordField from 'general/PasswordField'
import { login } from '../../utils/cognito-auth'
import Snackbar from 'material-ui/Snackbar'
import appTheme from 'theme/default'

class SignIn extends React.Component {
  constructor (props) {
    super(props)
    this.password = null

    this.state = {
      alertOpen: false,
      alertMsg: '',
      loggingUser: false
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
      const username = this.username.input.value.trim()
      this.logUserIn(username, password,
        () => {
          goToDashboard()
        },
        (err) => {
          this.showAlert(err.message)
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

  handleAlertRequestClose () {
    this.setState({
      alertOpen: false,
      alertMsg: ''
    })
  }

  showAlert (msg) {
    this.setState({
      alertOpen: true,
      alertMsg: msg
    })
  }

  retrievePassword () {
    goToRetrievePassword()
  }

  render () {
    const main = {
      backgroundColor: '#7C4DFF'

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
      textAlign: 'center',
      marginRight: 10
    }

    const retrievePasswordLink = {
      color: '#FFF',
      cursor: 'pointer',
      fontSize: 11
    }

    const actions = {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      width: '100%',
      marginTop: 20
    }

    return (
      <div
        data-test-id={'login-form-container-test-id'}
        style={main}>
        <div
          style={container}>
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
              label={'LOGIN'}
              loading={this.state.loggingUser}
              onClicked={this.handleSubmit.bind(this)} />
          </div>

        </div>
        <Snackbar
          open={this.state.alertOpen}
          message={this.state.alertMsg}
          autoHideDuration={3000}
          onRequestClose={this.handleAlertRequestClose.bind(this)}
        />
      </div>
    )
  }
}

export default SignIn

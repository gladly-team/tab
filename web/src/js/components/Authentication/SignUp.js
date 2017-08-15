import React from 'react'
import { getReferralData, validateUsername } from 'web-utils'
import { goToDashboard, goToLogin } from 'navigation/navigation'

import environment from '../../../relay-env'

import EmailField from 'general/EmailField'
import AuthActionButtom from 'general/AuthActionButtom'
import PasswordField from 'general/PasswordField'
import { signup, login, getCurrentUser } from '../../utils/cognito-auth'

import CreateNewUserMutation from 'mutations/CreateNewUserMutation'

import Snackbar from 'material-ui/Snackbar'
import TextField from 'material-ui/TextField'
import appTheme from 'theme/default'

class SignUp extends React.Component {
  constructor (props) {
    super(props)
    this.password = null

    this.state = {
      alertOpen: false,
      alertMsg: '',
      registeringUser: false
    }
  }

  _handleKeyPress (e) {
    if (this.state.registeringUser) { return }

    if (e.key === 'Enter') {
      this.handleSubmit()
    }
  }

  validateUsername () {
    const username = this.username.input.value.trim()
    return validateUsername(username)
  }

  handleSubmit () {
    if (this.state.registeringUser) { return }

    // TODO: show validation errors
    if (this.password.validate() &&
        this.validateUsername() &&
        this.email.validate()) {
      const password = this.password.getValue()
      const username = this.username.input.value.trim()
      const email = this.email.getValue()
      this.registerUser(username, email, password)
    }
  }

  registerUser (username, email, password) {
    this.setState({
      registeringUser: true
    })

    signup(username, email, password,
      (response) => {
        this.logUserIn(username, password,
          () => {
            this.createNewUser(username, email)
          },
          (err) => {
            this.showAlert(err.message)
            this.registrationCompleted()
          })
      },
      (err) => {
        this.showAlert(err.message)
        this.registrationCompleted()
      })
  }

  registrationCompleted () {
    this.setState({
      registeringUser: false
    })
  }

  logUserIn (username, password, success, failure) {
    login(username, password, (res) => {
      success()
    }, (err) => {
      if (failure) { failure(err) }
    })
  }

  createNewUser (username, email) {
    getCurrentUser((user) => {
      if (user == null) {
        goToLogin()
      }

      const sub = user.sub
      const referralData = getReferralData()
      const self = this
      CreateNewUserMutation.commit(
        environment,
        sub,
        username,
        email,
        referralData,
        (response) => {
          self.registrationCompleted()
          goToDashboard()
        },
        (err) => {
          self.registrationCompleted()
          self.showAlert(err.message)
        }
      )
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

    const actions = {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      width: '100%',
      marginTop: 20
    }

    return (
      <div
        data-test-id={'register-form-container-test-id'}
        style={main}>
        <div
          style={container}>
          <TextField
            id={'signup-username-input-id'}
            ref={(input) => { this.username = input }}
            onKeyPress={this._handleKeyPress.bind(this)}
            floatingLabelText='Username'
            floatingLabelStyle={floatingLabelStyle}
            underlineStyle={underlineStyle}
            underlineFocusStyle={underlineFocusStyle}
            inputStyle={inputStyle} />
          <EmailField
            inputId={'signup-email-input-id'}
            ref={(input) => { this.email = input }}
            onKeyPress={this._handleKeyPress.bind(this)}
            floatingLabelText='Email'
            defaultValue={this.props.email}
            floatingLabelStyle={floatingLabelStyle}
            underlineStyle={underlineStyle}
            underlineFocusStyle={underlineFocusStyle}
            inputStyle={inputStyle} />
          <PasswordField
            inputId={'signup-password-input-id'}
            ref={(input) => { this.password = input }}
            onKeyPress={this._handleKeyPress.bind(this)}
            floatingLabelText='Password'
            floatingLabelStyle={floatingLabelStyle}
            underlineStyle={underlineStyle}
            underlineFocusStyle={underlineFocusStyle}
            type={'password'}
            inputStyle={inputStyle} />

          <div style={actions}>
            <AuthActionButtom
              btnId={'register-action-btn-id'}
              label={'REGISTER'}
              loading={this.state.registeringUser}
              onClicked={this.handleSubmit.bind(this)} />
          </div>
        </div>
        <Snackbar
          contentStyle={{textAlign: 'center'}}
          data-test-id={'signup-error-snackbar'}
          open={this.state.alertOpen}
          message={this.state.alertMsg}
          autoHideDuration={3000}
          onRequestClose={this.handleAlertRequestClose.bind(this)}
        />
      </div>
    )
  }
}

export default SignUp

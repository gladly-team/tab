import React from 'react'
import { getReferralData } from 'web-utils'
import { goToDashboard, goToLogin } from 'navigation/navigation'

import environment from '../../../relay-env'

import EmailField from 'general/EmailField'
import AuthActionButtom from 'general/AuthActionButtom'
import UsernameField from 'general/UsernameField'
import PasswordField from 'general/PasswordField'
import ErrorMessage from 'general/ErrorMessage'
import {
  signup,
  login,
  getCurrentUser,
  getMessageFromSignUpError
} from '../../utils/cognito-auth'

import CreateNewUserMutation from 'mutations/CreateNewUserMutation'

import appTheme from 'theme/default'

class SignUp extends React.Component {
  constructor (props) {
    super(props)
    this.password = null

    this.state = {
      errorMessage: '',
      registeringUser: false,
      usernameDuplicate: false
    }
  }

  _handleKeyPress (e) {
    if (this.state.registeringUser) { return }

    if (e.key === 'Enter') {
      this.handleSubmit()
    }
  }

  handleSubmit () {
    if (this.state.registeringUser) { return }

    // TODO: show validation errors
    if (this.password.validate() &&
        this.username.validate() &&
        this.email.validate()) {
      const password = this.password.getValue()
      const username = this.username.getValue()
      const email = this.email.getValue()
      this.registerUser(username, email, password)
    }
  }

  registerUser (username, email, password) {
    this.setState({
      registeringUser: true,
      usernameDuplicate: false
    })
    const self = this
    signup(username, email, password,
      (response) => {
        this.logUserIn(username, password,
          () => {
            this.createNewUser(username, email)
          },
          (err) => {
            console.error('error at registerUser:', err)
            self.showError("Oops, we're having trouble signing you up right now :(")
            this.registrationCompleted()
          })
      },
      (err) => {
        if (err.code === 'UsernameExistsException') {
          self.setState({
            usernameDuplicate: true
          })
        } else {
          self.setState({
            usernameDuplicate: false
          })
        }
        console.error(err)
        const errorMessage = getMessageFromSignUpError(err)
        this.showError(errorMessage)
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
          console.error('error at createNewUser:', err)
          self.registrationCompleted()
          self.showError("Oops, we're having trouble signing you up right now :(")
        }
      )
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
          <UsernameField
            inputId={'signup-username-input-id'}
            ref={(input) => { this.username = input }}
            onKeyPress={this._handleKeyPress.bind(this)}
            floatingLabelText='Username'
            floatingLabelStyle={floatingLabelStyle}
            underlineStyle={underlineStyle}
            underlineFocusStyle={underlineFocusStyle}
            inputStyle={inputStyle}
            usernameDuplicate={this.state.usernameDuplicate} />
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
        { this.state.errorMessage
          ? (<ErrorMessage
            message={this.state.errorMessage}
            onRequestClose={this.clearError.bind(this)} />)
          : null }
      </div>
    )
  }
}

export default SignUp

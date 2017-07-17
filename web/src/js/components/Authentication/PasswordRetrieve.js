import React from 'react'
import CodeField from 'general/CodeField'
import TextField from 'material-ui/TextField'
import PasswordField from 'general/PasswordField'
import { forgotPassword, confirmPassword, login } from '../../utils/cognito-auth'
import { goToDashboard, goToLogin } from 'navigation/navigation'
import FlatButton from 'material-ui/FlatButton'
import Snackbar from 'material-ui/Snackbar'
import AuthActionButtom from 'general/AuthActionButtom'
import logoHeader from 'assets/logos/tfc-title-white.png'
import {
  indigo500
} from 'material-ui/styles/colors'

import appTheme from 'theme/default'

class PasswordRetrieve extends React.Component {
  constructor (props) {
    super(props)
    this.email = null
    this.code = null
    this.password = null

    this.state = {
      email: null,
      responseNotify: false,
      notificationMsg: '',
      requesting: false
    }
  }

  _setEmail (e) {
    if (e.key === 'Enter') {
      this.setEmail()
    }
  }

  setEmail () {
    const email = this.email.input.value.trim()
    if (email && email.length > 0) {
      this.sendPasswordRecoveryRequest(email)
    }
  }

  sendPasswordRecoveryRequest (email) {
    forgotPassword(email, () => {
      this.setState({
        email: email
      })
      this.showNotificationAlert('Check your email to get the confirmation code')
    }, (err) => {
      console.error(err)
      this.setState({
        email: null
      })
      this.showNotificationAlert("We couldn't find an account that match this email")
    })
  }

  dataIsValid () {
    return this.code.validate() && this.password.validate()
  }

  _confirmPasswordHandler (e) {
    if (e.key === 'Enter') {
      this.confirmPassword()
    }
  }

  confirmPassword () {
    if (this.dataIsValid()) {
      const code = this.code.getValue()
      const password = this.password.getValue()
      this.confirmPasswordRequest(code, password)
    }
  }

  confirmPasswordRequest (code, password) {
    confirmPassword(this.state.email, code, password, () => {
      this.logUserIn(this.state.email, password, goToDashboard)
    }, (err) => {
      this.showNotificationAlert(err.message)
    })
  }

  logUserIn (email, password, success, failure) {
    login(email, password, (res) => {
      success()
    }, (err) => {
      if (failure) { failure(err) }
    })
  }

  handleRequestClose () {
    this.setState({
      responseNotify: false,
      notificationMsg: ''
    })
  }

  showNotificationAlert (msg) {
    this.setState({
      responseNotify: true,
      notificationMsg: msg
    })
  }

  goToLogin () {
    goToLogin()
  }

  render () {
    const main = {
      backgroundColor: indigo500,
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
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

    var email
    var code
    var password
    var action
    if (!this.state.email) {
      action = {
        id: 'retrieve-password-set-username-btn',
        label: 'SEND CODE',
        onClicked: this.setEmail.bind(this)
      }
      email = (<TextField
        id={'retrieve-password-username-input'}
        ref={(input) => { this.email = input }}
        onKeyPress={this._setEmail.bind(this)}
        floatingLabelText='Username or email'
        floatingLabelStyle={floatingLabelStyle}
        inputStyle={inputStyle}
        underlineStyle={underlineStyle}
        underlineFocusStyle={underlineFocusStyle} />)
    } else {
      action = {
        id: 'retrieve-password-reset-btn',
        label: 'RESET',
        onClicked: this.confirmPassword.bind(this)
      }
      code = (<CodeField
        ref={(input) => { this.code = input }}
        onKeyPress={this._confirmPasswordHandler.bind(this)}
        floatingLabelText='Enter your code'
        floatingLabelStyle={floatingLabelStyle}
        inputStyle={inputStyle}
        underlineStyle={underlineStyle}
        underlineFocusStyle={underlineFocusStyle} />)
      password = (<PasswordField
        inputId={'retrieve-password-pass-input'}
        ref={(input) => { this.password = input }}
        onKeyPress={this._confirmPasswordHandler.bind(this)}
        floatingLabelText='Password'
        floatingLabelStyle={floatingLabelStyle}
        inputStyle={inputStyle}
        underlineStyle={underlineStyle}
        underlineFocusStyle={underlineFocusStyle} />)
    }

    const navigation = {
      position: 'absolute',
      top: 10,
      right: 10,
      color: appTheme.palette.alternateTextColor
    }

    const header = {
      position: 'absolute',
      top: 100
    }

    const actionBtn = {
      marginTop: 40
    }

    return (
      <div style={main}>
        <img style={header} src={logoHeader} />
        {email}
        {code}
        {password}
        <AuthActionButtom
          containerStyle={actionBtn}
          btnId={action.id}
          label={action.label}
          loading={this.state.requesting}
          onClicked={action.onClicked} />
        <FlatButton
          style={navigation}
          label={'BACK TO LOGIN'}
          onClick={this.goToLogin.bind(this)} />
        <Snackbar
          open={this.state.responseNotify}
          message={this.state.notificationMsg}
          autoHideDuration={3000}
          onRequestClose={this.handleRequestClose.bind(this)} />
      </div>
    )
  }
}

export default PasswordRetrieve

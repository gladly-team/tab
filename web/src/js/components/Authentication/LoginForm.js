import React from 'react'
import PropTypes from 'prop-types'
import { getReferralData } from 'web-utils'
import { goToDashboard, goToLogin } from 'navigation/navigation'

import FadeInAnimation from 'general/FadeInAnimation'

import environment from '../../../relay-env'

import ConfirmationForm from './ConfirmationForm'
import LoadingPage from 'general/LoadingPage'
import CircleButton from 'general/CircleButton'
import PasswordField from 'general/PasswordField'
import { login, getOrCreate, getCurrentUser } from '../../utils/cognito-auth'

import CreateNewUserMutation from 'mutations/CreateNewUserMutation'

import FlatButton from 'material-ui/FlatButton'
import Snackbar from 'material-ui/Snackbar'

import appTheme from 'theme/default'

class LoginForm extends React.Component {
  constructor (props) {
    super(props)
    this.password = null

    this.state = {
      password: null,
      created: false,
      confirmed: true,
      alertOpen: false,
      alertMsg: '',
      createOnPasswordConfirm: false,
      loading: false,
      loadingMsg: ''
    }
  }

  _handleKeyPress (e) {
    if (e.key === 'Enter') {
      this.handleSubmit()
    }
  }

  handleSubmit () {
    if (this.password.validate()) {
      const password = this.password.getValue()

      this.setState({
        loading: true,
        loadingMsg: 'Checking provided credentials...'
      })

      getOrCreate(this.props.email, password,
          (response, created, confirmed) => {
            if (this.state.createOnPasswordConfirm) {
              this.createNewUser()
              return
            }

            if (confirmed) {
              if (!created) {
                this._goToDashboard()
              } else {
                this.onConfirmed(password)
              }
              return
            }

            this.setState({
              loading: false,
              loadingMsg: '',
              password: password,
              created: created,
              confirmed: confirmed
            })
          },
          (err) => {
            this.showAlert(err.message)
          })
    }
  }

  logUserIn (password, success, failure) {
    login(this.props.email, password, (res) => {
      success()
    }, (err) => {
      if (failure) { failure(err) }
    })
  }

  onConfirmed (password) {
    this.setState({
      loading: true,
      loadingMsg: 'Setting your profile...'
    })

    password = this.state.password || password
    this.logUserIn(password, this.createNewUser.bind(this), (err) => {
      this.showAlert(err.message)
      this.setState({
        confirmed: true,
        createOnPasswordConfirm: true
      })
    })
  }

  createNewUser () {
    getCurrentUser((user) => {
      if (user == null) {
        goToLogin()
      }

      const sub = user.sub
      const email = user.email

      const referralData = getReferralData()
      const self = this
      CreateNewUserMutation.commit(
          environment,
          sub,
          email,
          referralData,
          (response) => {
            self._goToDashboard()
          },
          (err) => {
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
      loading: false,
      loadingMsg: '',
      alertOpen: true,
      alertMsg: msg
    })
  }

  _goToDashboard () {
    this.setState({
      loading: true,
      loadingMsg: 'Redirecting to dashboard...'
    })

    setTimeout(() => {
      goToDashboard()
    }, 2000)
  }

  render () {
    if (this.state.loading) {
      return (<LoadingPage
        msg={this.state.loadingMsg} />)
    }

    if (!this.state.confirmed) {
      return (
        <FadeInAnimation>
          <ConfirmationForm
            email={this.props.email}
            onConfirmed={this.onConfirmed.bind(this)} />
        </FadeInAnimation>)
    }

    const main = {
      backgroundColor: '#7C4DFF',
      height: '100%',
      width: '100%',
      display: 'flex',
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

    const backBtn = {
      position: 'absolute',
      top: 10,
      left: 10,
      color: appTheme.palette.alternateTextColor
    }

    return (
      <div style={main}>
        <FlatButton
          style={backBtn}
          label='CHANGE EMAIL'
          onClick={this.props.onBack} />

        <div
          style={container}>
          <PasswordField
            ref={(input) => { this.password = input }}
            onKeyPress={this._handleKeyPress.bind(this)}
            floatingLabelText='Password'
            floatingLabelStyle={floatingLabelStyle}
            underlineStyle={underlineStyle}
            underlineFocusStyle={underlineFocusStyle}
            type={'password'}
            inputStyle={inputStyle}
          />
          <CircleButton
            size={40}
            onClick={this.handleSubmit.bind(this)} />
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

LoginForm.propTypes = {
  email: PropTypes.string,
  onBack: PropTypes.func
}

export default LoginForm

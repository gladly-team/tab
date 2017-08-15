import React from 'react'
import PropTypes from 'prop-types'
import TextField from 'material-ui/TextField'
import ConfirmationForm from './ConfirmationForm'
import { signup, login } from '../../utils/cognito-auth'
import { goToDashboard } from 'navigation/navigation'

import {
  blue500
} from 'material-ui/styles/colors'

class SignUpForm extends React.Component {
  constructor (props) {
    super(props)
    this.password = null

    this.state = {
      password: null,
      signed: false,
      confirmed: false
    }
  }

  _handleKeyPress (e) {
    if (e.key === 'Enter') {
      this.handleSubmit()
    }
  }

  handleSubmit () {
    if (this.password.input && this.password.input.value) {
      const password = this.password.input.value.trim()
      signup(this.props.email, password, (res) => {
        this.onSignUp(res, password)
      }, (err) => {
        console.error(err)
      })
    }
  }

  onSignUp (res, password) {
    this.setState({
      signed: true,
      confirmed: false,
      password: password
    })
  }

  onConfirmed () {
    if (this.state.password) {
      login(this.props.email, this.state.password, (res) => {
        goToDashboard()
      }, (err) => {
        console.error(err)
      })
    }
  }

  render () {
    if (this.state.signed && !this.state.confirmed) {
      return (<ConfirmationForm
        email={this.props.email}
        onConfirmed={this.onConfirmed.bind(this)} />)
    }

    const main = {
      backgroundColor: blue500,
      height: '100%',
      width: '100%',
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

    return (
      <div style={main}>
        <TextField
          ref={(input) => { this.password = input }}
          onKeyPress={this._handleKeyPress.bind(this)}
          floatingLabelText='Set a password'
          type='password'
          floatingLabelStyle={floatingLabelStyle}
          inputStyle={inputStyle} />
      </div>
    )
  }
}

SignUpForm.propTypes = {
  email: PropTypes.string.isRequired
}

export default SignUpForm

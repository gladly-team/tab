import React from 'react'
import { Paper } from 'material-ui'
import RaisedButton from 'material-ui/RaisedButton'
import {
  logout,
  sendVerificationEmail
} from 'authentication/user'
import {
  goTo,
  loginURL
} from 'navigation/navigation'

class VerifyEmailMessage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      emailResent: false,
      emailResendingInProgress: false,
      emailResendingError: false
    }
  }

  async resendEmailClick (e) {
    this.setState({
      emailResendingInProgress: true,
      emailResendingError: false
    })
    const emailSent = await sendVerificationEmail()
    if (emailSent) {
      this.setState({
        emailResent: true,
        emailResendingInProgress: false
      })
    } else {
      this.setState({
        emailResent: false,
        emailResendingError: true,
        emailResendingInProgress: false
      })
    }
  }

  async restartAuthFlow () {
    await logout()
    goTo(loginURL)
  }

  render () {
    var buttonLabel = 'RESEND EMAIL'
    var buttonDisabled = false
    if (this.state.emailResendingInProgress) {
      buttonLabel = 'SENDING EMAIL...'
      buttonDisabled = true
    } else if (this.state.emailResent) {
      buttonLabel = 'EMAIL RESENT'
      buttonDisabled = true
    } else if (this.state.emailResendingError) {
      buttonLabel = 'ERROR SENDING EMAIL'
      buttonDisabled = true
    }

    const cancelButtonLabel = 'CANCEL'

    return (
      <Paper
        zDepth={1}
        style={{
          padding: 24,
          maxWidth: 400,
          backgroundColor: '#FFF'
        }}
      >
        <p>Please check your email to verify your account.</p>
        <span
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: 24
          }}
          data-test-id={'verify-email-message-button-container'}
        >
          <RaisedButton
            label={cancelButtonLabel}
            disabled={buttonDisabled}
            onClick={this.restartAuthFlow.bind(this)}
            style={{
              marginRight: 8
            }}
          />
          <RaisedButton
            label={buttonLabel}
            primary
            disabled={buttonDisabled}
            onClick={this.resendEmailClick.bind(this)}
          />
        </span>
      </Paper>
    )
  }
}

export default VerifyEmailMessage

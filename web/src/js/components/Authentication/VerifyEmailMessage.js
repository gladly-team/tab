import React from 'react'
import { Paper } from 'material-ui'
import RaisedButton from 'material-ui/RaisedButton'
import {
  sendVerificationEmail
} from 'authentication/user'

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
    return (
      <Paper
        zDepth={1}
        style={{
          padding: 24,
          backgroundColor: '#FFF'
        }}
      >
        <span>Please check your email to verify your account.</span>
        <span
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: 24
          }}
        >
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

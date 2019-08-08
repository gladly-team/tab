import React from 'react'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import { logout, sendVerificationEmail } from 'js/authentication/user'
import { goTo, loginURL } from 'js/navigation/navigation'

class VerifyEmailMessage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      emailResent: false,
      emailResendingInProgress: false,
      emailResendingError: false,
    }
  }

  async resendEmailClick(e) {
    this.setState({
      emailResendingInProgress: true,
      emailResendingError: false,
    })
    const emailSent = await sendVerificationEmail() // TODO: pass "continue" URL
    if (emailSent) {
      this.setState({
        emailResent: true,
        emailResendingInProgress: false,
      })
    } else {
      this.setState({
        emailResent: false,
        emailResendingError: true,
        emailResendingInProgress: false,
      })
    }
  }

  async restartAuthFlow() {
    await logout()
    goTo(loginURL, null, { keepURLParams: true })
  }

  render() {
    const {
      emailResendingInProgress,
      emailResent,
      emailResendingError,
    } = this.state
    return (
      <Paper
        elevation={1}
        style={{
          padding: 24,
          // padding: '40px 24px',
          maxWidth: 400,
          backgroundColor: '#FFF',
        }}
      >
        <Typography variant={'body2'} gutterBottom>
          Please check your email to verify your account.
        </Typography>
        <span
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: 24,
          }}
        >
          <Button
            data-test-id={'verify-email-message-cancel-button'}
            color={'default'}
            variant={'contained'}
            onClick={this.restartAuthFlow.bind(this)}
            style={{
              marginRight: 8,
            }}
          >
            Cancel
          </Button>
          <Button
            data-test-id={'verify-email-message-resend-button'}
            color={'default'}
            variant={'contained'}
            disabled={
              emailResendingInProgress || emailResent || emailResendingError
            }
            onClick={this.resendEmailClick.bind(this)}
          >
            {emailResendingInProgress
              ? 'Sending email...'
              : emailResent
              ? 'Email resent'
              : emailResendingError
              ? 'Error sending email'
              : 'Resend email'}
          </Button>
        </span>
      </Paper>
    )
  }
}

export default VerifyEmailMessage

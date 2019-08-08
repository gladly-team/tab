import React from 'react'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import { logout, sendVerificationEmail } from 'js/authentication/user'
import {
  goTo,
  constructUrl,
  enterUsernameURL,
  loginURL,
} from 'js/navigation/navigation'
import { SEARCH_APP, TAB_APP } from 'js/constants'

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

    const { app } = this.props
    const emailSent = await sendVerificationEmail({
      // Pass the "app" URL parameter value in the verification email.
      continueURL: constructUrl(
        enterUsernameURL,
        { app: app },
        { absolute: true }
      ),
    })
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
          maxWidth: 400,
          backgroundColor: '#FFF',
        }}
      >
        <Typography
          variant={'body1'}
          style={{ marginTop: 8, marginBottom: 36 }}
        >
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

VerifyEmailMessage.propTypes = {
  app: PropTypes.oneOf([TAB_APP, SEARCH_APP]).isRequired,
}

VerifyEmailMessage.defaultProps = {
  app: TAB_APP,
}

export default VerifyEmailMessage

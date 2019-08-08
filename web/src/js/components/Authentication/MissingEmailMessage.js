import React from 'react'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import { logout } from 'js/authentication/user'
import { goTo, loginURL } from 'js/navigation/navigation'

class MissingEmailMessage extends React.Component {
  async restartAuthFlow() {
    await logout()
    goTo(loginURL, null, { keepURLParams: true })
  }

  render() {
    return (
      <Paper
        elevation={1}
        style={{
          padding: 24,
          maxWidth: 400,
          backgroundColor: '#FFF',
        }}
      >
        <Typography variant={'h6'} gutterBottom>
          We couldn't sign you in
        </Typography>
        <Typography variant={'body2'}>
          This can happen when Facebook or Google doesn't have your email
          address on file, which we use to create your account. Please try
          signing in with another method, such as an email and password.
        </Typography>

        <span
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: 24,
          }}
        >
          <Button
            data-test-id="missing-email-message-button"
            color={'primary'}
            variant={'contained'}
            onClick={this.restartAuthFlow.bind(this)}
          >
            Sign in using another method
          </Button>
        </span>
      </Paper>
    )
  }
}

export default MissingEmailMessage

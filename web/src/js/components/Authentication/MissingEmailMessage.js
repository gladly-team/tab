import React from 'react'
import { Paper } from 'material-ui'
import RaisedButton from 'material-ui/RaisedButton'
import {
  logout
} from 'authentication/user'
import {
  goTo,
  loginURL
} from 'navigation/navigation'

class MissingEmailMessage extends React.Component {
  async restartAuthFlow () {
    await logout()
    goTo(loginURL)
  }

  render () {
    var buttonLabel = 'SIGN IN USING ANOTHER METHOD'
    return (
      <Paper
        zDepth={1}
        style={{
          padding: 24,
          maxWidth: 400,
          backgroundColor: '#FFF'
        }}
      >
        <h3>We couldn't sign you in</h3>
        <p>This can happen when Facebook or Google doesn't have your email address on file,
         which we use to create your account.
         Please try signing in with another method, such as an email and password.</p>

        <span
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: 24
          }}
          data-test-id='missing-email-message-button-container'
        >
          <RaisedButton
            label={buttonLabel}
            primary
            onClick={this.restartAuthFlow.bind(this)}
          />
        </span>
      </Paper>
    )
  }
}

export default MissingEmailMessage

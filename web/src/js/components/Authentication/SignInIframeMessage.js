import React from 'react'
import { Paper } from 'material-ui'
import RaisedButton from 'material-ui/RaisedButton'
import {
  absoluteUrl,
  loginURL
} from 'navigation/navigation'

// This view primarily exists as an intermediary to open
// the authentication page outside of an iframe, because
// authentication may not work properly within an iframe.
// E.g., see: https://github.com/gladly-team/tab/issues/188
// Most often, users will see this if they are not authenticated
// and open a new tab; our browser extensions currently iframe
// the page.
class SignInIframeMessage extends React.Component {
  openAuthOutsideIframe () {
    window.open(absoluteUrl(loginURL), '_top')
  }

  render () {
    var buttonLabel = 'SIGN IN'
    return (
      <Paper
        zDepth={1}
        style={{
          padding: 24,
          maxWidth: 400,
          backgroundColor: '#FFF'
        }}
      >
        <h3>Let's get started!</h3>
        <p>Sign in to customize your new tab page and raise money for your favorite causes.</p>
        <span
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: 24
          }}
        >
          <RaisedButton
            data-test-id={'sign-in-iframe-message-button'}
            label={buttonLabel}
            primary
            onClick={this.openAuthOutsideIframe.bind(this)}
          />
        </span>
      </Paper>
    )
  }
}

export default SignInIframeMessage

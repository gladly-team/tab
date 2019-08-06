import React from 'react'
import PropTypes from 'prop-types'
import Paper from 'material-ui/Paper'
import Typography from '@material-ui/core/Typography'

// TODO: use latest MUI
import RaisedButton from 'material-ui/RaisedButton'
import Link from 'js/components/General/Link'
import { constructUrl, loginURL } from 'js/navigation/navigation'
import { parseUrlSearchString } from 'js/utils/utils'

// This view primarily exists as an intermediary to open
// the authentication page outside of an iframe, because
// authentication may not work properly within an iframe.
// E.g., see: https://github.com/gladly-team/tab/issues/188
// Most often, users will see this if they are not authenticated
// and open a new tab; our browser extensions currently iframe
// the page.
class SignInIframeMessage extends React.Component {
  render() {
    const { location: { search = '' } = {} } = this.props
    const urlParams = parseUrlSearchString(search)

    // Whether we are requiring the anonymous user to sign in.
    const showRequiredSignInExplanation = urlParams.mandatory === 'true'

    var buttonLabel = 'SIGN IN'
    return (
      <Paper
        zDepth={1}
        style={{
          padding: 24,
          maxWidth: 400,
          backgroundColor: '#FFF',
          marginBottom: 60,
        }}
      >
        <Typography variant={'h6'}>
          {showRequiredSignInExplanation
            ? `Great job so far!`
            : `Let's get started!`}
        </Typography>
        {showRequiredSignInExplanation ? (
          <Typography variant={'body2'}>
            You've already made a positive impact! Let's keep this progress
            safe: we ask you to sign in after a while so you don't lose access
            to your notes, bookmarks, and Hearts (even if you drop your computer
            in a puddle).
          </Typography>
        ) : (
          <Typography variant={'body2'}>
            Sign in to customize your new tab page and raise money for your
            favorite causes.
          </Typography>
        )}
        <span
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: 24,
          }}
        >
          <Link
            to={constructUrl(
              loginURL,
              { ...urlParams },
              {
                absolute: true,
              }
            )}
            target="_top"
          >
            <RaisedButton
              data-test-id={'sign-in-iframe-message-button'}
              label={buttonLabel}
              primary
            />
          </Link>
        </span>
      </Paper>
    )
  }
}

SignInIframeMessage.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }),
}

export default SignInIframeMessage

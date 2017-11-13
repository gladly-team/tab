import React from 'react'
import PropTypes from 'prop-types'
import * as firebase from 'firebase'
import { FirebaseAuth } from 'react-firebaseui'
import {
  dashboardURL
} from 'navigation/navigation'

class FirebaseAuthenticationUI extends React.Component {
  componentWillMount () {
    this.configureFirebaseUI()
  }

  configureFirebaseUI () {
    // Configure FirebaseUI.
    // https://github.com/firebase/firebaseui-web#example-with-all-parameters-used
    this.uiConfig = {
      // Either 'popup' or 'redirect'
      signInFlow: 'popup',
      // Redirect path after successful sign in, or a callbacks.signInSuccess function
      signInSuccessUrl: dashboardURL,
      // Auth providers
      // https://github.com/firebase/firebaseui-web#configure-oauth-providers
      signInOptions: [
        {
          provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          scopes: ['https://www.googleapis.com/auth/userinfo.email']
        },
        {
          provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID,
          scopes: ['email']
        },
        {
          provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
          requireDisplayName: false
        }
      ],
      callbacks: {
        signInSuccess: (currentUser, credential, redirectUrl) => {
          this.props.onSignInSuccess(currentUser, credential, redirectUrl)

          // Do not automatically redirect to the signInSuccessUrl.
          return false
        }
      },
      // Just using the constant rather than importing firebaseui
      // https://github.com/firebase/firebaseui-web#credential-helper
      // https://github.com/firebase/firebaseui-web/blob/bd710448caa34c4a47a2fd578d76be8506d392d8/javascript/widgets/config.js#L83
      credentialHelper: 'none',
      tosUrl: 'https://tab.gladly.io/more/terms'
    }
  }

  render () {
    return (
      <FirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()} />
    )
  }
}

FirebaseAuthenticationUI.propTypes = {
  onSignInSuccess: PropTypes.func.isRequired
}

// https://github.com/facebook/react/issues/6653
FirebaseAuthenticationUI.defaultProps = {
  onSignInSuccess: () => {}
}

export default FirebaseAuthenticationUI

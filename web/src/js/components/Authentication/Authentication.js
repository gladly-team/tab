import React from 'react'
import AppBarWithLogo from '../Logo/AppBarWithLogo'
import {
  primaryColor
} from 'theme/default'
import * as firebase from 'firebase'
import { FirebaseAuth } from 'react-firebaseui'
import { dashboardURL } from 'navigation/navigation'

// Configure FirebaseUI.
// https://github.com/firebase/firebaseui-web#example-with-all-parameters-used
const uiConfig = {
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
  // TODO: This is not functional. Update it when fixed. See:
  // https://github.com/firebase/firebaseui-web-react/issues/2
  // https://github.com/firebase/firebaseui-web#credential-helper
  credentialHelper: 'firebaseui.auth.CredentialHelper.NONE',
  tosUrl: 'https://tab.gladly.io/more/terms'
}

class Authentication extends React.Component {
  componentDidMount () {
    // TODO
    // getCurrentUser((user) => {
    //   if (user && user.sub) {
    //     goToDashboard()
    //   }
    // })
  }

  render () {
    return (
      <span
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          height: '100%',
          width: '100%',
          backgroundColor: primaryColor
        }}
      >
        <AppBarWithLogo />
        <span
          style={{
            display: 'flex',
            flex: 1,
            alignSelf: 'stretch',
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: 100
          }}
        >
          <FirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
        </span>
      </span>
    )
  }
}

export default Authentication

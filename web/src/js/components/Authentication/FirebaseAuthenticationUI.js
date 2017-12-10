import React from 'react'
import PropTypes from 'prop-types'
import * as firebase from 'firebase'
import { FirebaseAuth } from 'react-firebaseui'
import {
  dashboardURL
} from 'navigation/navigation'
import {
  signupPageButtonClick,
  signupPageEmailButtonClick,
  signupPageSocialButtonClick
} from 'analytics/logEvent'

class FirebaseAuthenticationUI extends React.Component {
  componentWillMount () {
    this.configureFirebaseUI()
  }

  componentWillUnmount () {
    this.removeButtonClickListeners()
  }

  socialButtonClicked (e) {
    signupPageButtonClick()
    signupPageSocialButtonClick()
  }

  emailButtonClicked (e) {
    signupPageButtonClick()
    signupPageEmailButtonClick()
  }

  // Poll a few times for an element by classnames
  async getElementByClassNamePolling (classnames) {
    function getElems () {
      return document.getElementsByClassName(classnames)
    }
    function timeout (ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    }
    var elems = []
    const timesToPoll = 10
    const pollIntervalMs = 100
    var times = 0
    while (times < timesToPoll) {
      elems = getElems()
      if (elems.length) {
        return elems[0]
      }
      // If could not find the elem, continue polling
      times += 1
      await timeout(pollIntervalMs)
    }
    return null
  }

  // TODO: fix this hack after replacing/updating firebaseweb-ui.
  // This callback is called before the sign-in buttons are
  // rendered, so poll for the elements.
  async addButtonClickListeners () {
    // Facebook
    const facebookButton = await this.getElementByClassNamePolling(
      'firebaseui-idp-button firebaseui-idp-facebook')
    if (facebookButton) {
      facebookButton.addEventListener('click', this.socialButtonClicked)
    }

    // Google
    const googleButton = await this.getElementByClassNamePolling(
      'firebaseui-idp-button firebaseui-idp-google')
    if (googleButton) {
      googleButton.addEventListener('click', this.socialButtonClicked)
    }

    // // Twitter
    // const twitterButton = await this.getElementByClassNamePolling(
    //   'firebaseui-idp-button firebaseui-idp-twitter')
    // if (twitterButton) {
    //   twitterButton.addEventListener('click', this.socialButtonClicked)
    // }

    // Email & password
    const emailButton = await this.getElementByClassNamePolling(
      'firebaseui-idp-button firebaseui-idp-password')
    if (emailButton) {
      emailButton.addEventListener('click', this.emailButtonClicked)
    }
  }

  async removeButtonClickListeners () {
    // Facebook
    const facebookButton = await this.getElementByClassNamePolling(
      'firebaseui-idp-button firebaseui-idp-facebook')
    if (facebookButton) {
      facebookButton.removeEventListener('click', this.socialButtonClicked)
    }

    // Google
    const googleButton = await this.getElementByClassNamePolling(
      'firebaseui-idp-button firebaseui-idp-google')
    if (googleButton) {
      googleButton.removeEventListener('click', this.socialButtonClicked)
    }

    // // Twitter
    // const twitterButton = await this.getElementByClassNamePolling(
    //   'firebaseui-idp-button firebaseui-idp-twitter')
    // if (twitterButton) {
    //   twitterButton.removeEventListener('click', this.socialButtonClicked)
    // }

    // Email & password
    const emailButton = await this.getElementByClassNamePolling(
      'firebaseui-idp-button firebaseui-idp-password')
    if (emailButton) {
      emailButton.removeEventListener('click', this.emailButtonClicked)
    }
  }

  configureFirebaseUI () {
    // Configure FirebaseUI.
    // https://github.com/firebase/firebaseui-web#example-with-all-parameters-used
    this.uiConfig = {
      // Either 'popup' or 'redirect'
      signInFlow: 'redirect',
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
        },
        uiShown: () => {
          this.addButtonClickListeners()
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

import React from 'react'
import PropTypes from 'prop-types'
import firebase from 'firebase/app'
import 'firebase/auth'
import { FirebaseAuth } from 'react-firebaseui'
import {
  absoluteUrl,
  dashboardURL,
  privacyPolicyURL,
  termsOfServiceURL
} from 'navigation/navigation'
import {
  signupPageButtonClick,
  signupPageEmailButtonClick,
  signupPageSocialButtonClick
} from 'analytics/logEvent'
import logger from 'utils/logger'

class FirebaseAuthenticationUI extends React.Component {
  constructor (props) {
    super(props)
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
      // Allow anonymous users to sign in.
      autoUpgradeAnonymousUsers: true,
      callbacks: {
        signInSuccessWithAuthResult: (authResult, redirectUrl) => {
          // Note: we can check if it's a new user with
          // `authResult.additionalUserInfo.isNewUser`.
          this.props.onSignInSuccess(authResult.user)

          // Do not automatically redirect to the signInSuccessUrl.
          return false
        },
        uiShown: () => {
          this.addButtonClickListeners()
        },
        // The signInFailure callback must be provided to handle merge conflicts which
        // occur when an existing credential is linked to an anonymous user.
        // https://firebase.google.com/docs/auth/web/firebaseui?authuser=0#handling_anonymous_user_upgrade_merge_conflicts
        // https://github.com/firebase/firebaseui-web#handling-anonymous-user-upgrade-merge-conflicts
        signInFailure: error => {
          // For merge conflicts, the error.code will be
          // 'firebaseui/anonymous-upgrade-merge-conflict'.
          if (error.code !== 'firebaseui/anonymous-upgrade-merge-conflict') {
            return Promise.resolve()
          }

          const anonymousUser = firebase.auth().currentUser

          // The existing credential the user tried to sign in with.
          var cred = error.credential

          // TODO:
          // Mark the anonymous user as merged in our database (a duplicate).

          // Sign in as the existing user.
          return firebase.auth().signInAndRetrieveDataWithCredential(cred)
            .then(authResult => {
              const authedUser = authResult.user

              // Delete the anonymous user in Firebase.
              return anonymousUser.delete()
                .catch(e => {
                  logger.error(e)
                })
                .finally(() => {
                  // Proceed with sign-in as usual.
                  this.props.onSignInSuccess(authedUser)
                })
            })
            .catch(e => {
              logger.error(e)
            })
        }
      },
      // Just using the constant rather than importing firebaseui
      // https://github.com/firebase/firebaseui-web#credential-helper
      // https://github.com/firebase/firebaseui-web/blob/bd710448caa34c4a47a2fd578d76be8506d392d8/javascript/widgets/config.js#L83
      credentialHelper: 'none',
      // Terms of service URL
      tosUrl: absoluteUrl(termsOfServiceURL),
      // Privacy policy URL
      privacyPolicyUrl: absoluteUrl(privacyPolicyURL)
    }
  }

  render () {
    return (
      <FirebaseAuth
        uiConfig={this.uiConfig}
        firebaseAuth={firebase.auth()}
      />
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

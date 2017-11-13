import React from 'react'
import PropTypes from 'prop-types'
import AppBarWithLogo from '../Logo/AppBarWithLogo'
import {
  primaryColor
} from 'theme/default'
import {
  getCurrentUser,
  sendVerificationEmail
} from 'authentication/user'
import {
  goTo,
  replaceUrl,
  verifyEmailURL,
  enterUsernameURL,
  goToDashboard,
  goToLogin
} from 'navigation/navigation'

class Authentication extends React.Component {
  componentWillMount () {
    this.navigateToAuthStep()
  }

  // Whether this is rendering an /auth/action/ page, which include
  // email confirmation links and password reset links.
  isAuthActionURL () {
    return this.props.location.pathname.indexOf('/auth/action/') !== -1
  }

  async navigateToAuthStep () {
    // Don't do anything on /auth/action/ pages, which include
    // email confirmation links and password reset links.
    if (this.isAuthActionURL()) {
      return
    }

    // Send the user to the appropriate page for the next
    // step in sign-up, or send them to the dashboard if
    // the sign-up is completed.
    const user = await getCurrentUser()
    // If the user is not logged in, go to main authentication page.
    if (!user) {
      goToLogin()
    // If the user's email is not verified, ask them to
    // check their email.
    } else if (!user.emailVerified) {
      replaceUrl(verifyEmailURL)
    // Check if the user has a username. If not,
    // send the user to enter a username.
    } else if (!user.username) {
      replaceUrl(enterUsernameURL)
    // Go to the dashboard.
    } else {
      goToDashboard()
    }
  }

  /**
   * Called when the user signs in.
   * At this point, the user may or may not have a verified email
   * or a username.
   * @param {object} currentUser - A Firebase user instance
   * @param {string} credential - firebase.auth.AuthCredential
   * @param {string} redirectUrl - The default URL to redirect after sign-in.
   * @returns {Promise<boolean>}  A promise that resolves into a boolean,
   *   whether or not the email was sent successfully.
   */
  onSignInSuccess (currentUser, credential, redirectUrl) {
    // Check if the user has verified their email.
    // Note: later versions of firebaseui-web might support mandatory
    // email verification:
    // https://github.com/firebase/firebaseui-web/issues/21
    if (!currentUser.emailVerified) {
      // Ask the user to verify their email.
      sendVerificationEmail()
        .then((emailSent) => {
          // TODO: show the user an error message if the email does not send
          goTo(verifyEmailURL)
        })
    // Check if the user has a username. If not,
    // send the user to enter a username.
    } else if (!currentUser.username) {
      replaceUrl(enterUsernameURL)
    // Go to the dashboard.
    } else {
      goToDashboard()
    }
  }

  // TODO: don't render any children until AFTER checking
  // the user's authed state. Otherwise, immediate unmounting of
  // FirebaseAuthenticationUI can throw errors.
  render () {
    return (
      <span
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
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
            alignItems: 'center'
          }}
        >
          <span
            style={{
              padding: 20,
              marginBottom: 20
            }}
          >
            {
              React.Children.map(this.props.children,
                (child) => React.cloneElement(child, {
                  onSignInSuccess: this.onSignInSuccess
                })
              )
            }
          </span>
        </span>
      </span>
    )
  }
}

Authentication.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  })
}

export default Authentication

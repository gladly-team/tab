import React from 'react'
import PropTypes from 'prop-types'
import environment from '../../../relay-env'
import AppBarWithLogo from '../Logo/AppBarWithLogo'
import {
  primaryColor
} from 'theme/default'
import {
  getCurrentUser,
  sendVerificationEmail,
  setUsernameInLocalStorage
} from 'authentication/user'
import {
  goTo,
  replaceUrl,
  verifyEmailURL,
  enterUsernameURL,
  goToDashboard,
  goToLogin
} from 'navigation/navigation'
import CreateNewUserMutation from 'mutations/CreateNewUserMutation'
import { getReferralData } from 'web-utils'
import { isEqual } from 'lodash/lang'

// Handle the authentication flow:
//   check if current user is fully authenticated and redirect
//     to the app if they are; otherwise: ->
//   authenticate with Firebase ->
//   receive onSignInSuccess callback (called for both new
//     and existing users) ->
//   idempotently create a new user in our database ->
//   check if user's email is verified. If not, send a
//     verification email and ask the user to check their email;
//     otherwise: ->
//   fetch the user from our database and ensure they have a
//     username. If not, ask the user to enter a username;
//     otherwise, set the username in localStorage so we know it
//     exists in other views without needing to fetch it from the
//     database. Then, redirect to the app.
// This is somewhat convoluted for a few reasons:
//  * we're using Firebase UI for most authentication views, and it
//    does not support mandatory email verification or extra fields
//    (such as a username)
//  * we're making the username mandatory but can't rely on a field
//    from the authentication user token to store this info
class Authentication extends React.Component {
  componentWillMount () {
    this.navigateToAuthStep()
  }

  componentWillReceiveProps (nextProps) {
    if (!isEqual(nextProps.user, this.props.user)) {
      this.navigateToAuthStep()
    }
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
    const authTokenUser = await getCurrentUser()
    // If the user is not logged in, go to main authentication page.
    if (!authTokenUser) {
      goToLogin()
    // If the user's email is not verified, ask them to
    // check their email.
    } else if (!authTokenUser.emailVerified) {
      replaceUrl(verifyEmailURL)
    // Check if the user has a username. If not,
    // send the user to enter a username.
    } else if (!authTokenUser.username) {
      // If the username isn't in localStorage, check if it
      // exists on the user from the database.
      // We use the user fetched from the database because
      // the username property isn't present on our auth token
      // user identity.
      if (this.props.user && this.props.user.username) {
        // The username exists; set it in localStorage and continue
        // to the app.
        setUsernameInLocalStorage(this.props.user.username)
        goToDashboard()
      } else {
        replaceUrl(enterUsernameURL)
      }
    // Go to the dashboard.
    } else {
      goToDashboard()
    }
  }

  /**
   * Called when the user signs in (for both new and existing users).
   * At this point, the user may or may not have a verified email
   * or a username.
   * @param {object} currentUser - A Firebase user instance
   * @param {string} credential - firebase.auth.AuthCredential
   * @param {string} redirectUrl - The default URL to redirect after sign-in.
   * @returns {Promise<boolean>}  A promise that resolves into a boolean,
   *   whether or not the email was sent successfully.
   */
  onSignInSuccess (currentUser, credential, redirectUrl) {
    // Create a new user in our database.
    this.createNewUser(currentUser.uid, currentUser.email)
      .then(() => {
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
        } else {
          // Fetch the user from our database. This will update the `user`
          // prop, which will let us navigate to the appropriate step in
          // authentication.
          this.props.fetchUser()
        }
      })
      .catch((err) => {
        console.error(err)
      })
  }

  // Create a new user in our database. This is idempotent because
  // it will be called when returning users sign in.
  createNewUser (userId, email) {
    const referralData = getReferralData()
    return new Promise((resolve, reject) => {
      CreateNewUserMutation.commit(
        environment,
        userId,
        email,
        referralData,
        (response) => {
          resolve(true)
        },
        (err) => {
          console.error('Error at createNewUser:', err)
          reject(new Error('Could not create new user', err))
        }
      )
    })
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
                  onSignInSuccess: this.onSignInSuccess.bind(this)
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
  }),
  // User fetched from our database (not the auth service user).
  user: PropTypes.shape({
    username: PropTypes.string
  }),
  fetchUser: PropTypes.func.isRequired
}

export default Authentication

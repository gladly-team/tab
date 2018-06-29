import React from 'react'
import PropTypes from 'prop-types'
import environment from '../../../relay-env'
import {
  getCurrentUser,
  sendVerificationEmail,
  setUsernameInLocalStorage
} from 'authentication/user'
import {
  goTo,
  authMessageURL,
  missingEmailMessageURL,
  replaceUrl,
  verifyEmailURL,
  enterUsernameURL,
  goToDashboard,
  goToLogin
} from 'navigation/navigation'
import CreateNewUserMutation from 'mutations/CreateNewUserMutation'
import {
  getReferralData,
  isInIframe
} from 'web-utils'
import { isEqual } from 'lodash/lang'
import LogoWithText from '../Logo/LogoWithText'

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
  constructor (props) {
    super(props)
    this.state = {
      loadChildren: false
    }
  }

  // TODO: change to componentDidMount
  async componentWillMount () {
    this.mounted = true

    await this.navigateToAuthStep()

    // Don't render any children until after checking the user's
    // authed state. Otherwise, immediate unmounting of
    // FirebaseAuthenticationUI can cause errors.
    // We check `this.mounted` to make sure we don't set state after
    // the component has unmounted. This is hacky; it would be
    // better to cancel the async call on unmount or use a flux-like
    // data flow. See:
    // https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
    if (this.mounted) {
      this.setState({
        loadChildren: true
      })
    }
  }

  componentWillUnmount () {
    this.mounted = false
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
      // If the page is in an iframe (e.g. the user opened it via an iframed
      // new tab), authentication may not work correctly. Show an intermediary
      // page that will open a non-iframed auth page.
      if (isInIframe()) {
        goTo(authMessageURL)
      } else {
        goToLogin()
      }
    // If the user does not have an email address, show a message
    // asking them to sign in with a different method.
    } else if (!authTokenUser.email) {
      goTo(missingEmailMessageURL)
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
    // Check that the user has an email address.
    // An email address may be missing if the user signs in
    // with a social provider that does not share their
    // email address. In this case, ask the user to sign in
    // via another method.
    if (!currentUser.email) {
      goTo(missingEmailMessageURL)
      return
    }

    // Get or create the user
    return this.createNewUser(currentUser.uid, currentUser.email)
      .then((createdOrFetchedUser) => {
        // Check if the user has verified their email.
        // Note: later versions of firebaseui-web might support mandatory
        // email verification:
        // https://github.com/firebase/firebaseui-web/issues/21
        if (!currentUser.emailVerified) {
          // Ask the user to verify their email.
          sendVerificationEmail()
            .then((emailSent) => {
              goTo(verifyEmailURL)
            })
            .catch((err) => {
              // TODO: show error message to the user
              console.error(err)
            })
        } else {
          // Fetch the user from our database. This will update the `user`
          // prop, which will let us navigate to the appropriate step in
          // authentication.
          this.props.fetchUser()
        }
      })
      .catch((err) => {
        // TODO: show error message to the user
        console.error(err)
      })
  }

  /**
   * Create a new user in our database, or get the user if they already
   * exist. This is idempotent and will be called when returning users sign in.
   * @param {string} userId - The userId from Firebase
   * @param {string} email - The user's email address from Firebase
   * @returns {Promise<object>} user - A promise that resolves into an
   *   object with a few requested fields
   * @returns {string} user.id - The user's ID, the same value as the
   *   userId argument
   * @returns {string} user.email - The user's email, the same value as the
   *   email argument
   * @returns {string|null} user.username - The user's username, if already
   *   set; or null, if not yet set
   */
  createNewUser (userId, email) {
    const referralData = getReferralData()
    return new Promise((resolve, reject) => {
      CreateNewUserMutation(
        environment,
        userId,
        email,
        referralData,
        (response) => {
          resolve(response.createNewUser)
        },
        (err) => {
          console.error('Error at createNewUser:', err)
          reject(new Error('Could not create new user', err))
        }
      )
    })
  }

  render () {
    return (
      <span
        data-test-id={'authentication-page'}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: '100%',
          width: '100%',
          backgroundColor: '#FAFAFA'
        }}
      >
        {/* This is a similar style to the homepage */}
        <div style={{ padding: '20px 40px', position: 'absolute', top: 0, left: 0 }}>
          <LogoWithText style={{ height: 40 }} />
        </div>
        <span
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            alignSelf: 'stretch',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <span
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              padding: 20
            }}
          >
            { this.state.loadChildren
              ? React.Children.map(this.props.children,
                (child) => React.cloneElement(child, {
                  onSignInSuccess: this.onSignInSuccess.bind(this),
                  user: this.props.user
                })
              )
              : null
            }
          </span>
          {/* Using style from homepage */}
          <span style={{
            color: 'rgba(33, 33, 33, 0.82)',
            fontFamily: "'Helvetica Neue','Helvetica','Arial',sans-serif",
            fontWeight: '500',
            lineHeight: '1.1',
            textAlign: 'center',
            padding: 10
          }}>
            <h1>"One of the simplest ways to raise money"</h1>
            <p style={{ color: '#838383', fontWeight: '400' }}>- USA Today</p>
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
    id: PropTypes.string,
    username: PropTypes.string
  }),
  fetchUser: PropTypes.func.isRequired
}

export default Authentication

import React from 'react'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import {
  getCurrentUser,
  sendVerificationEmail
} from 'authentication/user'
import {
  checkAuthStateAndRedirectIfNeeded,
  createNewUser
} from 'authentication/helpers'
import {
  goTo,
  authMessageURL,
  missingEmailMessageURL,
  verifyEmailURL,
  goToDashboard
} from 'js/navigation/navigation'
import { isEqual } from 'lodash/lang'
import LogoWithText from '../Logo/LogoWithText'
import {
  getUrlParameters
} from 'utils/utils'

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
      loadChildren: false,
      // Whether we are requiring the anonymous user to sign in.
      isMandatoryAnonymousSignIn: getUrlParameters()['mandatory'] === 'true'
    }
  }

  async componentDidMount () {
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

    // Redirect to the appropriate authentication view if the
    // user is not fully authenticated.
    const usernameFromServer = this.props.user ? this.props.user.username : null
    try {
      var redirected = await checkAuthStateAndRedirectIfNeeded(authTokenUser, usernameFromServer)
    } catch (e) {
      throw e
    }

    // When anonymous users choose to sign in, do not go back to the
    // dashboard.
    const stayOnAuthPage = getUrlParameters()['noredirect'] === 'true'

    // The user is fully authed, so go to the dashboard.
    if (!redirected && !stayOnAuthPage) {
      goToDashboard()
    }
  }

  /**
   * Called when the user signs in (for both new and existing users).
   * At this point, the user may or may not have a verified email
   * or a username.
   * @param {object} currentUser - A Firebase user instance
   * @returns {Promise<boolean>}  A promise that resolves into a boolean,
   *   whether or not the email was sent successfully.
   */
  onSignInSuccess (currentUser) {
    // Check that the user has an email address.
    // An email address may be missing if the user signs in
    // with a social provider that does not share their
    // email address. In this case, ask the user to sign in
    // via another method.
    if (!currentUser.email) {
      goTo(missingEmailMessageURL)
      return
    }

    // Get or create the user.
    // Important: we expect to call this on every sign-in event,
    // even for anonymous users who already have a user in our
    // database, because this is when we add their email address
    // and email verification status to their profile.
    return createNewUser()
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

  render () {
    const showRequiredSignInExplanation = (
      this.state.isMandatoryAnonymousSignIn &&
      // Don't display the message on the iframe auth message page, because
      // it will have its own message.
      this.props.location.pathname.indexOf(authMessageURL) === -1
    )
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
          { !showRequiredSignInExplanation
            ? (
              // Using same style as homepage
              <span
                data-test-id={'endorsement-quote'}
                style={{
                  color: 'rgba(33, 33, 33, 0.82)',
                  fontFamily: "'Helvetica Neue','Helvetica','Arial',sans-serif",
                  fontWeight: '500',
                  lineHeight: '1.1',
                  textAlign: 'center',
                  padding: 10
                }}
              >
                <h1>"One of the simplest ways to raise money"</h1>
                <p style={{ color: '#838383', fontWeight: '400' }}>- USA Today</p>
              </span>
            )
            : null
          }
        </span>
        { showRequiredSignInExplanation
          ? (
            <div
              data-test-id={'anon-sign-in-fyi'}
              style={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                bottom: 24
              }}
            >
              <Paper>
                <div
                  style={{
                    padding: '14px 18px',
                    maxWidth: 600
                  }}
                >
                  <Typography variant={'body2'}>Hey there!</Typography>
                  <Typography variant={'body1'}>
                      We ask you to sign in after a while so you don't lose
                      access to your notes, bookmarks, and Hearts (even if you drop your
                      computer in a puddle). Signing in also lets you sync your tab between
                      browsers – nice!
                  </Typography>
                </div>
              </Paper>
            </div>
          )
          : null
        }
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

import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { get } from 'lodash/object'
import Paper from '@material-ui/core/Paper'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { isEqual } from 'lodash/lang'
import { Route, Switch } from 'react-router-dom'
import FirebaseAuthenticationUI from 'js/components/Authentication/FirebaseAuthenticationUI'
import VerifyEmailMessage from 'js/components/Authentication/VerifyEmailMessage'
import EnterUsernameForm from 'js/components/Authentication/EnterUsernameForm'
import SignInIframeMessage from 'js/components/Authentication/SignInIframeMessage'
import MissingEmailMessage from 'js/components/Authentication/MissingEmailMessage'
import { sendVerificationEmail } from 'js/authentication/user'
import {
  redirectToAuthIfNeeded,
  createNewUser,
} from 'js/authentication/helpers'
import {
  constructUrl,
  goTo,
  authMessageURL,
  enterUsernameURL,
  missingEmailMessageURL,
  verifyEmailURL,
  getPostAuthURL,
} from 'js/navigation/navigation'
import { externalRedirect } from 'js/navigation/utils'
import Logo from 'js/components/Logo/Logo'
import searchFavicon from 'js/assets/logos/search-favicon.png'
import tabFavicon from 'js/assets/logos/favicon.ico'
import {
  getUrlParameters,
  parseUrlSearchString,
  validateAppName,
} from 'js/utils/utils'
import AssignExperimentGroups from 'js/components/Dashboard/AssignExperimentGroupsContainer'
import logger from 'js/utils/logger'
import tabTheme from 'js/theme/defaultV1'
import searchTheme from 'js/theme/searchTheme'
import { SEARCH_APP, TAB_APP } from 'js/constants'
import optIntoV4Beta from 'js/utils/v4-beta-opt-in'
import { isTabV4BetaUser } from 'js/utils/local-user-data-mgr'
import SetV4BetaMutation from 'js/mutations/SetV4BetaMutation'
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
  async componentDidMount() {
    await this.navigateToAuthStep()
  }

  componentWillReceiveProps(nextProps) {
    // After the authUser object changes, automatically redirect
    // to the current authentication step.
    if (!isEqual(nextProps.authUser, this.props.authUser)) {
      this.navigateToAuthStep()
    }
  }

  // Whether this is rendering an /auth/action/ page, which include
  // email confirmation links and password reset links.
  isAuthActionURL() {
    return this.props.location.pathname.indexOf('/auth/action/') !== -1
  }

  getApp() {
    const { location } = this.props
    const urlParams = parseUrlSearchString(location.search)

    // To determine the app, we also need to check the "app" URL
    // parameter value in the "continueUrl" parameter for when users
    // verify their email via Firebase.
    let firebaseContinueURLAppVal = null
    try {
      const continueURL = urlParams.continueUrl
      if (continueURL) {
        firebaseContinueURLAppVal = new URL(continueURL).searchParams.get('app')
      }
    } catch (e) {
      console.error(e)
    }
    return validateAppName(urlParams.app || firebaseContinueURLAppVal)
  }

  getNextURLIndex() {
    const { location } = this.props
    const urlParams = parseUrlSearchString(location.search)
    let nextURLIndex = urlParams.next ? decodeURIComponent(urlParams.next) : 0
    return nextURLIndex
  }

  // What we should do after the auth process is finished,
  // after account creation, email verification, and username
  // creation.
  async onAuthProcessCompleted() {
    const { user } = this.props

    // If needed, opt the user into Tab v4. We need to
    // do this *after* all of the auth logic on this app
    // because v4 does not yet have a complete auth flow.
    const enableTabV4 = get(user, 'v4BetaEnabled') || isTabV4BetaUser()
    const nextURLIndex = this.getNextURLIndex()
    const isSearchApp = this.getApp() === SEARCH_APP
    const destinationURL = getPostAuthURL(nextURLIndex, { isSearchApp })

    if (enableTabV4) {
      try {
        await optIntoV4Beta()
      } catch (e) {
        // TODO: show error to user / handle error more gracefully
        logger.error(e)
      }

      // If the local storage value is set to V4 but the user's
      // profile is not, update the user's profile.
      if (!get(user, 'v4BetaEnabled')) {
        await SetV4BetaMutation({
          userId: user.id,
          enabled: true,
        })
      }
    }

    externalRedirect(destinationURL)
  }

  async navigateToAuthStep() {
    // Don't do anything on /auth/action/ pages, which include
    // email confirmation links and password reset links.
    if (this.isAuthActionURL()) {
      return
    }
    const { authUser, location, user } = this.props
    const urlParams = parseUrlSearchString(location.search)

    const redirected = redirectToAuthIfNeeded({
      authUser,
      user,
      urlParams: {
        app: urlParams.app,
        next: urlParams.next,
        reauth: urlParams.reauth,
        accountDeleted: urlParams.accountDeleted,
      },
    })

    // When anonymous users choose to sign in, do not go back to the
    // dashboard.
    const stayOnAuthPage =
      urlParams.noredirect === 'true' || urlParams.reauth === 'true'

    // The user is fully authed, so go to the dashboard.
    if (!redirected && !stayOnAuthPage) {
      await this.onAuthProcessCompleted()
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
  onSignInSuccess(currentUser) {
    // Check that the user has an email address.
    // An email address may be missing if the user signs in
    // with a social provider that does not share their
    // email address. In this case, ask the user to sign in
    // via another method.
    if (!currentUser.email) {
      goTo(missingEmailMessageURL, null, { keepURLParams: true })
      return
    }

    const app = this.getApp()

    // Get or create the user.
    // Important: we expect to call this on every sign-in event,
    // even for anonymous users who already have a user in our
    // database, because this is when we add their email address
    // and email verification status to their profile.
    return createNewUser()
      .then(async createdOrFetchedUser => {
        // Check if the user has verified their email.
        // Note: later versions of firebaseui-web might support mandatory
        // email verification:
        // https://github.com/firebase/firebaseui-web/issues/21
        if (!currentUser.emailVerified) {
          // Ask the user to verify their email.
          sendVerificationEmail({
            // Pass the "app" and "next" URL parameter values in the
            // "continue URL" after email verification.
            continueURL: constructUrl(
              enterUsernameURL,
              { app: app, next: this.getNextURLIndex() },
              { absolute: true }
            ),
          })
            .then(emailSent => {
              goTo(verifyEmailURL, null, { keepURLParams: true })
            })
            .catch(err => {
              // TODO: show error message to the user
              logger.error(err)
            })
        } else {
          // Fetch the user from our database. This will update the `user`
          // prop, which will let us navigate to the appropriate step in
          // authentication.
          // https://github.com/gladly-team/tab/issues/589
          this.props.fetchUser()

          const urlParams = getUrlParameters()

          if (urlParams.reauth === 'true') {
            await this.onAuthProcessCompleted()
          }
        }
      })
      .catch(err => {
        // TODO: show error message to the user
        logger.error(err)
      })
  }

  render() {
    const { user, location } = this.props
    // Show a different logo depending on the app for which the user is
    // signing in.
    const app = this.getApp()
    // Set a different theme depending on the app.
    let theme = tabTheme
    switch (app) {
      case TAB_APP:
        theme = tabTheme
        break
      case SEARCH_APP:
        theme = searchTheme
        break
      default:
        theme = tabTheme
    }
    const defaultTheme = createMuiTheme(theme)

    // Whether we are requiring the anonymous user to sign in.
    const urlParams = parseUrlSearchString(location.search)
    const isMandatoryAnonymousSignIn = urlParams.mandatory === 'true'
    const showRequiredSignInExplanation =
      isMandatoryAnonymousSignIn &&
      // Don't display the message on the iframe auth message page, because
      // it will have its own message.
      location.pathname.indexOf(authMessageURL) === -1

    return (
      <MuiThemeProvider theme={defaultTheme}>
        <span
          data-test-id={'authentication-page'}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '100%',
            width: '100%',
            backgroundColor: '#FAFAFA',
          }}
        >
          {app === TAB_APP ? (
            <Helmet>
              <title>Sign in - Tab for a Cause</title>
              <link rel="icon" href={tabFavicon} />
            </Helmet>
          ) : (
            <Helmet>
              <title>Sign in - Search for a Cause</title>
              <link rel="icon" href={searchFavicon} key={'favicon'} />
            </Helmet>
          )}
          {/* This is a similar style to the homepage */}
          <div
            style={{
              padding: '20px 40px',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          >
            <Logo brand={app} includeText style={{ height: 40 }} />
          </div>
          <span
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              alignSelf: 'stretch',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 20,
              }}
            >
              {urlParams.reauth ? (
                <Typography
                  style={{
                    paddingBottom: 10,
                  }}
                  variant="h6"
                >
                  <span>First, please login again.</span>
                </Typography>
              ) : null}
              {urlParams.accountDeleted ? (
                <Typography
                  style={{
                    paddingBottom: 10,
                  }}
                  variant="h6"
                >
                  <span>Your account has been deleted.</span>
                </Typography>
              ) : null}
              <Switch>
                <Route
                  exact
                  path="/newtab/auth/verify-email/"
                  render={props => (
                    <VerifyEmailMessage {...props} user={user} app={app} />
                  )}
                />
                <Route
                  exact
                  path="/newtab/auth/username/"
                  render={props => (
                    <EnterUsernameForm
                      {...props}
                      user={user}
                      app={app}
                      onCompleted={this.onAuthProcessCompleted.bind(this)}
                    />
                  )}
                />
                <Route
                  exact
                  path="/newtab/auth/welcome/"
                  render={props => (
                    <SignInIframeMessage {...props} user={user} app={app} />
                  )}
                />
                <Route
                  exact
                  path="/newtab/auth/missing-email/"
                  component={MissingEmailMessage}
                />
                <Route
                  path="/newtab/auth/"
                  render={props => (
                    <FirebaseAuthenticationUI
                      {...props}
                      onSignInSuccess={this.onSignInSuccess.bind(this)}
                      user={user}
                      app={app}
                    />
                  )}
                />
              </Switch>
            </span>
            {!showRequiredSignInExplanation ? (
              // Using same style as homepage
              <span
                data-test-id={'endorsement-quote'}
                style={{
                  color: 'rgba(33, 33, 33, 0.82)',
                  fontFamily: "'Helvetica Neue','Helvetica','Arial',sans-serif",
                  fontWeight: '500',
                  lineHeight: '1.1',
                  textAlign: 'center',
                  padding: 10,
                }}
              >
                <h1>"One of the simplest ways to raise money"</h1>
                <p style={{ color: '#838383', fontWeight: '400' }}>
                  - USA Today
                </p>
              </span>
            ) : null}
          </span>
          {showRequiredSignInExplanation ? (
            <div
              data-test-id={'anon-sign-in-fyi'}
              style={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                bottom: 24,
              }}
            >
              <Paper elevation={1}>
                <div
                  style={{
                    padding: '14px 18px',
                    maxWidth: 600,
                  }}
                >
                  <Typography variant={'body2'} style={{ fontWeight: 'bold' }}>
                    Hey there!
                  </Typography>
                  <Typography variant={'body2'}>
                    We ask you to sign in after a while so you don't lose access
                    to your notes, bookmarks, and Hearts (even if you drop your
                    computer in a puddle). Signing in also lets you sync your
                    tab between browsers – nice!
                  </Typography>
                </div>
              </Paper>
            </div>
          ) : null}
          {/*
          If we don't assign experiment groups here because we redirect or the
          user does not yet exist, that's okay. We'll try to assign the user to
          experiments on the dashboard as well.
        */}
          {user ? <AssignExperimentGroups user={user} isNewUser /> : null}
        </span>
      </MuiThemeProvider>
    )
  }
}

Authentication.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
    search: PropTypes.string.isRequired,
  }),
  fetchUser: PropTypes.func.isRequired,
  // User fetched from the auth service.
  authUser: PropTypes.shape({
    id: PropTypes.string,
    email: PropTypes.string,
    username: PropTypes.string,
    isAnonymous: PropTypes.bool,
    emailVerified: PropTypes.bool,
  }),
  // User fetched from our database (not the auth service user).
  user: PropTypes.shape({
    id: PropTypes.string,
    username: PropTypes.string,
    v4BetaEnabled: PropTypes.bool,
  }),
}

export default Authentication

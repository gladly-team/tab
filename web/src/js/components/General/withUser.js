import React from 'react'
import { onAuthStateChanged } from 'js/authentication/user'
import {
  createAnonymousUserIfPossible,
  redirectToAuthIfNeeded,
} from 'js/authentication/helpers'
import logger from 'js/utils/logger'
import { makePromiseCancelable } from 'js/utils/utils'

// https://reactjs.org/docs/higher-order-components.html#convention-wrap-the-display-name-for-easy-debugging
function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

// FIXME: signing in or signing out gives an error of trying to
//   update state on an unmounted component.

/**
 * Adds an "authUser" prop, an AuthUser object from our authentication, to
 * the wrapped child component. Optionally, it attempts to create a user if
 * one does not exist and redirects to the authentication page if the user
 * is not fully authenticated.
 * @param {Object} options
 * @param {Boolean} options.renderIfNoUser - If true, we will render the
 *   children even if there is no user ID (the user is not signed in).
 *   Defaults to false.
 * @param {Boolean} options.createUserIfPossible - If true, when a user does
 *   not exist, we will create a new anonymous user both in our auth service
 *   and in our database. We might not always create a new user, depending on
 *   our anonymous user restrictions. Defaults to true.
 * @param {Boolean} options.redirectToAuthIfIncomplete - If true, when a user
 *   is not authenticated or has not completed sign-up (e.g. does not have a
 *   user ID), we will redirect to the appropriate authentication page.
 *   our anonymous user restrictions. It should be false when using withUser
 *   in a page where authentication is optional. Defaults to true.
 * @return {Function} A higher-order component.
 */
const withUser = (options = {}) => WrappedComponent => {
  class CompWithUser extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        authUser: null,
        authStateLoaded: false,
        userCreationInProgress: false,
      }
      this.authListenerUnsubscribe = null
      this.userCreatePromise = null
    }

    componentDidMount() {
      // Store unsubscribe function.
      // https://firebase.google.com/docs/reference/js/firebase.auth.Auth#onAuthStateChanged
      this.authListenerUnsubscribe = onAuthStateChanged(user => {
        this.determineAuthState(user)
      })
    }

    componentWillUnmount() {
      if (typeof this.authListenerUnsubscribe === 'function') {
        this.authListenerUnsubscribe()
      }
      if (this.userCreatePromise && this.userCreatePromise.cancel) {
        this.userCreatePromise.cancel()
      }
    }

    async determineAuthState(user) {
      const {
        createUserIfPossible = true,
        redirectToAuthIfIncomplete = true,
      } = options
      let authUser = user

      // If the user doesn't exist, create one if possible.
      if (!(user && user.id) && createUserIfPossible) {
        // Mark that user creation is in process so that we don't
        // don't render child components after the user is authed
        // but before the user exists in our database.
        this.setState({
          userCreationInProgress: true,
        })
        try {
          this.userCreatePromise = makePromiseCancelable(
            createAnonymousUserIfPossible()
          )
          authUser = await this.userCreatePromise.promise
        } catch (e) {
          // If the component already unmounted, don't do anything with
          // the returned data.
          if (e && e.isCanceled) {
            return
          }
          logger.error(e)
        }
        this.setState({
          userCreationInProgress: false,
        })
      }

      // If the user must complete the authentication process, optionally
      // redirect to the appropriate auth page.
      let redirected = false
      if (redirectToAuthIfIncomplete) {
        try {
          redirected = redirectToAuthIfNeeded(authUser)
        } catch (e) {
          logger.error(e)
        }
      }

      if (!redirected) {
        this.setState({
          authUser: authUser,
          authStateLoaded: true,
        })
      }
    }

    render() {
      const { renderIfNoUser = false } = options
      const { authUser, authStateLoaded, userCreationInProgress } = this.state
      // Don't render the children until we've determined the auth state.
      if (!authStateLoaded || userCreationInProgress) {
        return null
      }
      // Return null if the user is not authenticated but the children require
      // an authenticated user.
      if (!authUser && !renderIfNoUser) {
        return null
      }
      return <WrappedComponent authUser={authUser} {...this.props} />
    }
  }
  CompWithUser.displayName = `withUser(${getDisplayName(WrappedComponent)})`
  return CompWithUser
}

export default withUser

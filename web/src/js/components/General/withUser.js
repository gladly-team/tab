import React from 'react'
import { onAuthStateChanged } from 'js/authentication/user'
import {
  createAnonymousUserIfPossible,
  redirectToAuthIfNeeded,
} from 'js/authentication/helpers'
import logger from 'js/utils/logger'
import { makePromiseCancelable } from 'js/utils/utils'
import { TAB_APP } from 'js/constants'

// https://reactjs.org/docs/higher-order-components.html#convention-wrap-the-display-name-for-easy-debugging
function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

/**
 * Adds an "authUser" prop, an AuthUser object from our authentication, to
 * the wrapped child component. Optionally, it attempts to create a user if
 * one does not exist and redirects to the authentication page if the user
 * is not fully authenticated.
 * @param {Object} options
 * @param {String} options.app - One of "search" or "tab". This determines
 *   app-specific behavior, like the redirect URL. Defaults to "tab".
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
      this.mounted = false
    }

    componentDidMount() {
      this.mounted = true

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
      this.mounted = false
    }

    async determineAuthState(user) {
      const {
        app = TAB_APP,
        createUserIfPossible = true,
        redirectToAuthIfIncomplete = true,
      } = options
      let authUser = user

      // If the user doesn't exist, create one if possible.
      // IMPORTANT: this logic only works for Tab for a Cause, not Search.
      if (!(user && user.id) && createUserIfPossible) {
        // If options.app === 'search', warn that we don't support this
        // logic and don't do anything.
        // TODO

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

        // This is an antipattern, and canceling our promises on unmount
        // should handle the problem. However, in practice, the component
        // sometimes unmounts between the userCreatePromise resolving and
        // this point, causing an error when we try to update state on the
        // unmounted component. It shouldn't cause a memory leak, as we've
        // canceled the promise and unsubscribed the auth listener.
        // Note that this might be an error in our code, but it's not a
        // priority to investigate.
        if (!this.mounted) {
          return
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
          const urlParams = { app: app }
          redirected = redirectToAuthIfNeeded({ authUser, urlParams })
        } catch (e) {
          logger.error(e)
        }
      }

      if (!redirected && this.mounted) {
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

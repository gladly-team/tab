import React from 'react'
import { onAuthStateChanged } from 'js/authentication/user'
import { createAnonymousUserIfPossible } from 'js/authentication/helpers'
import logger from 'js/utils/logger'

// https://reactjs.org/docs/higher-order-components.html#convention-wrap-the-display-name-for-easy-debugging
function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

/**
 * Adds an AuthUser prop (from authentication) to a child component.
 * @param {Object} options
 * @param {Boolean} options.renderIfNoUser - If true, we will render the
 *   children even if there is no user ID (the user is not signed in).
 *   Defaults to false.
 * @param {Boolean} options.createUserIfPossible - If true, when a user does
 *   not exist, we will create a new anonymous user both in our auth service
 *   and in our database. We might not always create a new user, depending on
 *   our anonymous user restrictions. Defaults to true.
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
    }

    async determineAuthState(user) {
      const { createUserIfPossible = true } = options
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
          authUser = await createAnonymousUserIfPossible()
        } catch (e) {
          logger.error(e)
        } finally {
          this.setState({
            userCreationInProgress: false,
          })
        }
      }
      this.setState({
        authUser: authUser,
        authStateLoaded: true,
      })
    }

    render() {
      const { renderIfNoUser = false } = options
      const { authUser, authStateLoaded, userCreationInProgress } = this.state
      // Don't render the children until we've determined the auth state.
      // if (!authStateLoaded) {
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
  CompWithUser.displayName = `CompWithUser(${getDisplayName(WrappedComponent)})`
  return CompWithUser
}

export default withUser

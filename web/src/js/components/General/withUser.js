import React from 'react'
import { onAuthStateChanged } from 'js/authentication/user'

// https://reactjs.org/docs/higher-order-components.html#convention-wrap-the-display-name-for-easy-debugging
function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

/**
 * Adds an AuthUser prop (from authentication) to a child component.
 * @param {Object} options
 * @param {Boolean} options.renderIfNoUser - If true, we will render the
 *   children even if there is no user ID (the user is not signed in).
 * @return {Function} A higher-order component.
 */
const withUser = (options = {}) => WrappedComponent => {
  class CompWithUser extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        authUser: null,
        authStateLoaded: false,
      }
    }

    componentDidMount() {
      // Store unsubscribe function.
      // https://firebase.google.com/docs/reference/js/firebase.auth.Auth#onAuthStateChanged
      this.authListenerUnsubscribe = onAuthStateChanged(user => {
        if (user && user.id) {
          this.setState({
            authUser: user,
          })
        }
        this.setState({
          authStateLoaded: true,
        })
      })
    }

    componentWillUnmount() {
      if (typeof this.authListenerUnsubscribe === 'function') {
        this.authListenerUnsubscribe()
      }
    }

    render() {
      const { renderIfNoUser } = options
      // Return null if the user is not authenticated but the children require
      // an authenticated user.
      if (!this.state.authUser && !renderIfNoUser) {
        return null
      }
      // Don't render the children until we've retrieved the user.
      if (!this.state.authStateLoaded) {
        return null
      }
      return <WrappedComponent authUser={this.state.authUser} {...this.props} />
    }
  }
  CompWithUser.displayName = `CompWithUser(${getDisplayName(WrappedComponent)})`
  return CompWithUser
}

export default withUser

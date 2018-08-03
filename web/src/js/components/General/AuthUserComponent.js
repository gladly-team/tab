import React from 'react'
import PropTypes from 'prop-types'
import {
  formatUser,
  getCurrentUserListener
} from 'authentication/user'
import {
  checkAuthStateAndRedirectIfNeeded
} from 'authentication/helpers'

// Get the authenticated user and, if the user is authenticated,
// add the user's ID to the `variables` prop. By default, redirect
// to the authentication view if the user is not authenticated.
// TODO: change to a higher-order component:
// https://reactjs.org/docs/higher-order-components.html
class AuthUserComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      userId: null
    }
  }

  componentDidMount () {
    // Store unsubscribe function.
    // https://firebase.google.com/docs/reference/js/firebase.auth.Auth#onAuthStateChanged
    this.authListenerUnsubscribe = getCurrentUserListener()
      .onAuthStateChanged((user) => {
        // TODO: roll the formatting functionality into the
        // listener.
        if (user) {
          const formattedUser = formatUser(user)
          this.checkUserAuth(formattedUser)
        } else {
          this.checkUserAuth(user)
        }
      })
  }

  componentWillUnmount () {
    if (typeof this.authListenerUnsubscribe === 'function') {
      this.authListenerUnsubscribe()
    }
  }

  checkUserAuth (user) {
    // If the user is authed, set the ID in state.
    if (user && user.id) {
      this.setState({
        userId: user.id
      })
    }

    // Stay on this page if it's okay to render children
    // regardless on the user auth status.
    if (this.props.allowUnauthedRender) {
      return
    }

    // If the user is not fully logged in, redirect to the
    // appropriate auth page.
    checkAuthStateAndRedirectIfNeeded(user)
  }

  render () {
    if (!this.state.userId && !this.props.allowUnauthedRender) {
      return null
    }

    const root = {
      height: '100%',
      width: '100%'
    }

    const childrenWithProps = React.Children.map(this.props.children,
      (child) => React.cloneElement(child, {
        variables: Object.assign({}, this.props.variables, {
          userId: this.state.userId
        })
      })
    )

    return (
      <div style={root}>
        {childrenWithProps}
      </div>
    )
  }
}

AuthUserComponent.propTypes = {
  variables: PropTypes.object,
  // Whether to render the children even if the user is not
  // authenticated.
  allowUnauthedRender: PropTypes.bool
}

AuthUserComponent.defaultProps = {
  variables: {},
  allowUnauthedRender: false
}

export default AuthUserComponent

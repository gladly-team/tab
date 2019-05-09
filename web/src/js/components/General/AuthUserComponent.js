import React from 'react'
import PropTypes from 'prop-types'
import { onAuthStateChanged } from 'js/authentication/user'
import { checkAuthStateAndRedirectIfNeeded } from 'js/authentication/helpers'

// Get the authenticated user and, if the user is authenticated,
// add the user's ID to the `variables` prop. By default, redirect
// to the authentication view if the user is not authenticated.
// TODO: change to a higher-order component:
// https://reactjs.org/docs/higher-order-components.html
class AuthUserComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userId: null,
    }
  }

  componentDidMount() {
    // Note: currently, this callback may be called when a user does not
    // exist on the server side, and some requests may fail.
    this.authListenerUnsubscribe = onAuthStateChanged(user => {
      this.checkUserAuth(user)
    })
  }

  componentWillUnmount() {
    if (typeof this.authListenerUnsubscribe === 'function') {
      this.authListenerUnsubscribe()
    }
  }

  async checkUserAuth(user) {
    // If the user is not fully logged in, redirect to the
    // appropriate auth page.
    try {
      var redirecting = await checkAuthStateAndRedirectIfNeeded(user)
    } catch (e) {
      throw e
    }

    // If the user is authed, set the ID in state.
    if (!redirecting && user && user.id) {
      this.setState({
        userId: user.id,
      })
    }
  }

  render() {
    if (!this.state.userId) {
      return null
    }

    const root = {
      height: '100%',
      width: '100%',
    }

    const childrenWithProps = React.Children.map(this.props.children, child =>
      React.cloneElement(child, {
        variables: Object.assign({}, this.props.variables, {
          userId: this.state.userId,
        }),
      })
    )

    return <div style={root}>{childrenWithProps}</div>
  }
}

AuthUserComponent.propTypes = {
  variables: PropTypes.object,
}

AuthUserComponent.defaultProps = {
  variables: {},
}

export default AuthUserComponent

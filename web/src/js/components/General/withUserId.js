import React from 'react'
import {
  getCurrentUserListener
} from 'js/authentication/user'

// https://reactjs.org/docs/higher-order-components.html#convention-wrap-the-display-name-for-easy-debugging
function getDisplayName (WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

function withUserId (WrappedComponent) {
  class CompWithUserId extends React.Component {
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
          if (user && user.uid) {
            this.setState({
              userId: user.uid
            })
          }
        })
    }

    componentWillUnmount () {
      if (typeof this.authListenerUnsubscribe === 'function') {
        this.authListenerUnsubscribe()
      }
    }

    render () {
      if (!this.state.userId) {
        return null
      }
      return <WrappedComponent userId={this.state.userId} {...this.props} />
    }
  }
  CompWithUserId.displayName = `CompWithUserId(${getDisplayName(WrappedComponent)})`
  return CompWithUserId
}

export default withUserId

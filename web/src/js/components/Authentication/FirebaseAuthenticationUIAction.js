import React from 'react'
import {
  checkIfEmailVerified
} from 'authentication/helpers'

class FirebaseAuthenticationUIAction extends React.Component {
  componentDidMount () {
    // See if the user verified their email address so that we can
    // log the verification. It would be better to user a cloud
    // function for this, or at least an official callback from the
    // Firebase SDK, but Firebase does not yet support one. See:
    // https://stackoverflow.com/q/43503377
    checkIfEmailVerified()
  }

  render () {
    return null
  }
}

FirebaseAuthenticationUIAction.propTypes = {}
FirebaseAuthenticationUIAction.defaultProps = {}

export default FirebaseAuthenticationUIAction

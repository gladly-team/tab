import React from 'react'
import PropTypes from 'prop-types'
import { QueryRenderer } from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import { get } from 'lodash/object'
import environment from 'js/relay-env'
import AuthenticationContainer from 'js/components/Authentication/AuthenticationContainer'
import { createNewUser } from 'js/authentication/helpers'
import { ERROR_USER_DOES_NOT_EXIST } from 'js/constants'
import logger from 'js/utils/logger'
import withUser from 'js/components/General/withUser'
import { makePromiseCancelable } from 'js/utils/utils'

// Fetch the user from our database if the user is
// authenticated.
class AuthenticationView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      refetchCounter: 0,
    }
    this.mounted = false
    this.createNewUserAttempts = 0
    this.createNewUserPromise = null
  }

  componentDidMount() {
    this.mounted = true
  }

  componentWillUnmount() {
    if (this.createNewUserPromise && this.createNewUserPromise.cancel) {
      this.createNewUserPromise.cancel()
    }
    this.mounted = false
  }

  // If we have an authed user with a user ID, fetch the
  // user from our database.
  // This will force Relay to refetch by modifying the
  // variables object. We could also use the `retry`
  // QueryRenderer function instead.
  // Pass this to children to allow a forced refetch after
  // we create a new user in our database.
  async fetchUser() {
    // This is an antipattern, and canceling our promises on unmount
    // should handle the problem. However, in practice, the component
    // sometimes unmounts between the userCreatePromise resolving and
    // this point, causing an error when we try to update state on the
    // unmounted component. It shouldn't cause a memory leak, as we've
    // also canceled the promise.
    // Note that this might be an error in our code, but it's not a
    // priority to investigate.
    if (!this.mounted) {
      return
    }
    const { refetchCounter } = this.state
    this.setState({
      refetchCounter: refetchCounter + 1,
    })
  }

  render() {
    const { authUser } = this.props
    const { refetchCounter } = this.state
    const userId = authUser && authUser.id ? authUser.id : null
    return (
      <QueryRenderer
        environment={environment}
        query={
          userId
            ? graphql`
                query AuthenticationViewQuery($userId: String!) {
                  user(userId: $userId) {
                    ...AuthenticationContainer_user
                  }
                }
              `
            : undefined
        }
        variables={
          userId
            ? {
                userId: userId,
                refetchCounter: refetchCounter,
              }
            : {}
        }
        render={({ error, props }) => {
          if (error && get(error, 'source.errors')) {
            // If any of the errors is because the user does not exist
            // on the server side, create the user and re-query if
            // possible.
            const userDoesNotExistError = error.source.errors.some(
              err => err.code === ERROR_USER_DOES_NOT_EXIST
            )

            // Limit the number of times we try to refetch a user after
            // trying to create the user to prevent a loop in case of
            // any bugs.
            if (userDoesNotExistError && this.createNewUserAttempts < 3) {
              this.createNewUserAttempts = this.createNewUserAttempts + 1

              // Cancel new user creation on unmount.
              this.createNewUserPromise = makePromiseCancelable(createNewUser())
              this.createNewUserPromise.promise
                .then(user => {
                  this.fetchUser()
                })
                .catch(e => {
                  if (e && e.isCanceled) {
                    return
                  }
                  throw e
                })
            } else {
              logger.error(error)
            }
          }

          // Wait for the query to return to render content.
          if (!props) {
            return null
          }
          const user = props.user || null
          return <AuthenticationContainer user={user} {...this.props} />
        }}
      />
    )
  }
}

AuthenticationView.propTypes = {
  authUser: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }),
}

AuthenticationView.defaultProps = {}

export default withUser({
  renderIfNoUser: true,
  redirectToAuthIfIncomplete: false,
})(AuthenticationView)

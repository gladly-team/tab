import React from 'react'
import { QueryRenderer } from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import { get } from 'lodash/object'
import environment from 'js/relay-env'
import AuthenticationContainer from 'js/components/Authentication/AuthenticationContainer'
import { getCurrentUser } from 'js/authentication/user'
import { createNewUser } from 'js/authentication/helpers'
import { ERROR_USER_DOES_NOT_EXIST } from 'js/constants'
import logger from 'js/utils/logger'

// Fetch the user from our database if the user is
// authenticated.
class AuthenticationView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      relayVariables: {
        userId: null,
        refetchCounter: 0,
      },
    }
    this.createNewUserAttempts = 0
  }

  componentDidMount() {
    this.fetchUser()
  }

  // If we have an authed user with a user ID, fetch the
  // user from our database.
  // This will force Relay to refetch by modifying the
  // variables object. We could also use the `retry`
  // QueryRenderer function instead.
  // Pass this to children to allow a forced refetch after
  // we create a new user in our database.
  async fetchUser() {
    const user = await getCurrentUser()
    if (user && user.id) {
      this.setState({
        relayVariables: Object.assign({}, this.state.relayVariables, {
          userId: user.id,
          refetchCounter: this.state.relayVariables.refetchCounter + 1,
        }),
      })
    }
  }

  render() {
    var query
    if (this.state.relayVariables.userId) {
      query = graphql`
        query AuthenticationViewQuery($userId: String!) {
          user(userId: $userId) {
            ...AuthenticationContainer_user
          }
        }
      `
    }
    return (
      <QueryRenderer
        environment={environment}
        query={query}
        variables={this.state.relayVariables}
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
              createNewUser()
                .then(user => {
                  this.fetchUser()
                })
                .catch(e => {
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
          return (
            <AuthenticationContainer
              user={user}
              fetchUser={this.fetchUser.bind(this)}
              {...this.props}
            />
          )
        }}
      />
    )
  }
}

export default AuthenticationView

/* global graphql */

import React from 'react'
import { QueryRenderer } from 'react-relay/compat'
import environment from '../../../relay-env'
import AuthenticationContainer from './AuthenticationContainer'
import {
  getCurrentUser
} from 'authentication/user'

// Fetch the user from our database if the user is
// authenticated.
class AuthenticationView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      relayVariables: {
        userId: null,
        refetchCounter: 0
      }
    }
  }

  async componentDidMount () {
    await this.fetchUser()
  }

  // If we have an authed user with a user ID, fetch the
  // user from our database.
  // This will force Relay to refetch by modifying the
  // variables object. We could also use the `retry`
  // QueryRenderer function instead.
  // Pass this to children to allow a forced refetch after
  // we create a new user in our database.
  async fetchUser () {
    const user = await getCurrentUser()
    if (user && user.id) {
      this.setState({
        relayVariables: Object.assign({}, this.state.relayVariables, {
          userId: user.id,
          refetchCounter: this.state.relayVariables.refetchCounter + 1
        })
      })
    }
  }

  render () {
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
          if (error) {
            console.error(error, error.source)
          }
          if (!props) {
            props = {}
          }
          const user = props.user || null
          return (
            <AuthenticationContainer
              user={user}
              fetchUser={this.fetchUser.bind(this)}
              {...this.props}
            />
          )
        }} />
    )
  }
}

export default AuthenticationView

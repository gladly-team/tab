/* global graphql */

import React from 'react'
import PropTypes from 'prop-types'
import {QueryRenderer} from 'react-relay/compat'
import environment from '../../../relay-env'
import AuthUserComponent from 'general/AuthUserComponent'
import AuthenticationContainer from './AuthenticationContainer'
import { isEqual } from 'lodash/lang'

// Fetch the user from our database if the user is
// authenticated.
class AuthenticationViewQueryRenderer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      relayVariables: {
        userId: null,
        refetchCounter: 0
      }
    }
  }

  componentWillMount () {
    this.fetchUser()
  }

  componentWillReceiveProps (nextProps) {
    const { variables } = nextProps
    if (variables.userId && !isEqual(nextProps.variables, this.props.variables)) {
      this.fetchUser(nextProps.variables.userId)
    }
  }

  // If we have an authed user with a user ID, fetch the
  // user from our database.
  // This will force Relay to refetch by modifying the
  // variables object. See:
  // https://stackoverflow.com/a/44769425/1332513
  // Pass this to children to allow a forced refetch after
  // we create a new user in our database.
  fetchUser (userIdOverride = null) {
    const userId = userIdOverride || this.props.variables.userId
    if (userId) {
      this.setState({
        relayVariables: Object.assign({}, this.state.relayVariables, {
          userId: userId,
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
        render={({error, props}) => {
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

AuthenticationViewQueryRenderer.propTypes = {
  variables: PropTypes.shape({
    userId: PropTypes.string
  })
}

AuthenticationViewQueryRenderer.defaultProps = {
  variables: {}
}

class AuthenticationView extends React.Component {
  render () {
    return (
      <AuthUserComponent allowUnauthedRender>
        <AuthenticationViewQueryRenderer {...this.props} />
      </AuthUserComponent>
    )
  }
}

export default AuthenticationView

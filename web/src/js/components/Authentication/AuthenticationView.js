import React from 'react'
import PropTypes from 'prop-types'
import graphql from 'babel-plugin-relay/macro'
import { get } from 'lodash/object'
import QueryRendererWithUser from 'js/components/General/QueryRendererWithUser'
import AuthenticationContainer from 'js/components/Authentication/AuthenticationContainer'
import logger from 'js/utils/logger'
import withUser from 'js/components/General/withUser'

// Fetch the user from our database if the user is
// authenticated.
class AuthenticationView extends React.Component {
  render() {
    const { authUser } = this.props
    const userId = authUser && authUser.id ? authUser.id : null
    return (
      <QueryRendererWithUser
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
              }
            : {}
        }
        render={({ error, props, retry }) => {
          if (error && get(error, 'source.errors')) {
            logger.error(error)
          }

          // Wait for the query to return to render content.
          if (!props) {
            return null
          }
          const user = props.user || null
          const fetchUserFunc = retry || function() {}
          return (
            <AuthenticationContainer
              user={user}
              fetchUser={fetchUserFunc}
              {...this.props}
            />
          )
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

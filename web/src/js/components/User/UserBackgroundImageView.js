/* global graphql */

import React from 'react'
import {QueryRenderer} from 'react-relay/compat'
import environment from '../../../relay-env'
import AuthUserComponent from 'general/AuthUserComponent'

import UserBackgroundImage from './UserBackgroundImageContainer'

class UserBackgroundImageView extends React.Component {
  render () {
    return (
      <AuthUserComponent>
        <QueryRenderer
          environment={environment}
          query={graphql`
            query UserBackgroundImageViewQuery($userId: String!) {
              user(userId: $userId) {
                ...UserBackgroundImageContainer_user
              }
            }
          `}
          render={({error, props}) => {
            if (error) {
              return null
            }
            var user = (props && props.user) ? props.user : null
            return (
              <UserBackgroundImage user={user} />
            )
          }} />
      </AuthUserComponent>
    )
  }
}

export default UserBackgroundImageView

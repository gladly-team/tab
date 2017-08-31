/* global graphql */

import React from 'react'
import {QueryRenderer} from 'react-relay/compat'
import environment from '../../../relay-env'
import AuthUserComponent from 'general/AuthUserComponent'

import ErrorMessage from 'general/ErrorMessage'
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
              console.error(error, error.source)
              const errMsg = 'We had a problem getting your background image :('
              return <ErrorMessage message={errMsg} />
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

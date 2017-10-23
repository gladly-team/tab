/* global graphql */

import React from 'react'
import {QueryRenderer} from 'react-relay/compat'
import environment from '../../../../relay-env'

import ProfileInviteFriend from './ProfileInviteFriendContainer'

import FullScreenProgress from 'general/FullScreenProgress'
import AuthUserComponent from 'general/AuthUserComponent'
import ErrorMessage from 'general/ErrorMessage'

class ProfileInviteFriendView extends React.Component {
  render () {
    return (
      <AuthUserComponent>
        <QueryRenderer
          environment={environment}
          query={graphql`
            query ProfileInviteFriendViewQuery($userId: String!) {
              user(userId: $userId) {
                ...ProfileInviteFriendContainer_user
              }
            }
          `}
          render={({error, props}) => {
            if (error) {
              console.error(error, error.source)
              const errMsg = 'We had a problem loading your stats :('
              return <ErrorMessage message={errMsg} />
            }
            if (props) {
              const showError = this.props.showError
              return (
                <ProfileInviteFriend
                  user={props.user}
                  showError={showError} />
              )
            } else {
              return (<FullScreenProgress />)
            }
          }} />
      </AuthUserComponent>
    )
  }
}

export default ProfileInviteFriendView

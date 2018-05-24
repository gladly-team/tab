/* global graphql */

import React from 'react'
import {QueryRenderer} from 'react-relay/compat'
import environment from '../../../../relay-env'

import SettingsChildWrapper from '../SettingsChildWrapperComponent'
import ProfileInviteFriend from './ProfileInviteFriendContainer'
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
              app {
                ...ProfileInviteFriendContainer_app
              }
              user(userId: $userId) {
                ...ProfileInviteFriendContainer_user
              }
            }
          `}
          render={({error, props}) => {
            if (error) {
              console.error(error, error.source)
              const errMsg = 'We had a problem loading this page :('
              return <ErrorMessage message={errMsg} />
            }
            const showError = this.props.showError
            const dataLoaded = !!props
            return (
              <SettingsChildWrapper loaded={dataLoaded}>
                { dataLoaded
                  ? (
                    <ProfileInviteFriend
                      app={props.app}
                      user={props.user}
                      showError={showError} />
                  )
                  : null
                }
              </SettingsChildWrapper>
            )
          }} />
      </AuthUserComponent>
    )
  }
}

export default ProfileInviteFriendView

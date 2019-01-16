import React from 'react'
import { QueryRenderer } from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import environment from 'js/relay-env'

import SettingsChildWrapper from 'js/components/Settings/SettingsChildWrapperComponent'
import ProfileInviteFriend from 'js/components/Settings/Profile/ProfileInviteFriendContainer'
import AuthUserComponent from 'js/components/General/AuthUserComponent'
import ErrorMessage from 'js/components/General/ErrorMessage'

class ProfileInviteFriendView extends React.Component {
  render() {
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
          render={({ error, props }) => {
            if (error) {
              console.error(error, error.source)
              const errMsg = 'We had a problem loading this page :('
              return <ErrorMessage message={errMsg} />
            }
            const showError = this.props.showError
            const dataLoaded = !!props
            return (
              <SettingsChildWrapper loaded={dataLoaded}>
                {dataLoaded ? (
                  <ProfileInviteFriend
                    app={props.app}
                    user={props.user}
                    showError={showError}
                  />
                ) : null}
              </SettingsChildWrapper>
            )
          }}
        />
      </AuthUserComponent>
    )
  }
}

export default ProfileInviteFriendView

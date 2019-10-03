import React from 'react'
import PropTypes from 'prop-types'
import QueryRendererWithUser from 'js/components/General/QueryRendererWithUser'
import graphql from 'babel-plugin-relay/macro'

import SettingsChildWrapper from 'js/components/Settings/SettingsChildWrapperComponent'
import ProfileInviteFriend from 'js/components/Settings/Profile/ProfileInviteFriendContainer'
import ErrorMessage from 'js/components/General/ErrorMessage'
import logger from 'js/utils/logger'

class ProfileInviteFriendView extends React.Component {
  render() {
    const { authUser } = this.props
    return (
      <div
        style={{
          height: '100%',
          width: '100%',
        }}
      >
        <QueryRendererWithUser
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
          variables={{
            userId: authUser.id,
          }}
          render={({ error, props }) => {
            if (error) {
              logger.error(error)
              const errMsg = 'We had a problem loading this page :('

              // Error will not autohide.
              return <ErrorMessage message={errMsg} open />
            }
            const showError = this.props.showError
            const dataLoaded = !!props
            return (
              <SettingsChildWrapper>
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
      </div>
    )
  }
}

ProfileInviteFriendView.propTypes = {
  authUser: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
  showError: PropTypes.func.isRequired,
}

ProfileInviteFriendView.defaultProps = {}

export default ProfileInviteFriendView

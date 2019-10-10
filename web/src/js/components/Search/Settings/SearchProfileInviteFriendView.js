import React from 'react'
import PropTypes from 'prop-types'
import QueryRendererWithUser from 'js/components/General/QueryRendererWithUser'

import SettingsChildWrapper from 'js/components/Settings/SettingsChildWrapperComponent'
import SearchProfileInviteFriend from 'js/components/Search/Settings/SearchProfileInviteFriendComponent'
import ErrorMessage from 'js/components/General/ErrorMessage'
import logger from 'js/utils/logger'

class ProfileInviteFriendView extends React.Component {
  render() {
    return (
      <div
        style={{
          height: '100%',
          width: '100%',
        }}
      >
        <QueryRendererWithUser
          query={null}
          variables={{}}
          render={({ error, props }) => {
            if (error) {
              logger.error(error)
              const errMsg = 'We had a problem loading this page :('

              // Error will not autohide.
              return <ErrorMessage message={errMsg} open />
            }
            const showError = this.props.showError
            return (
              <SettingsChildWrapper>
                <SearchProfileInviteFriend showError={showError} />
              </SettingsChildWrapper>
            )
          }}
        />
      </div>
    )
  }
}

ProfileInviteFriendView.propTypes = {
  showError: PropTypes.func.isRequired,
}

ProfileInviteFriendView.defaultProps = {}

export default ProfileInviteFriendView

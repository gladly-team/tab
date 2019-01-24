import React from 'react'
import { QueryRenderer } from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import environment from 'js/relay-env'

import SettingsChildWrapper from 'js/components/Settings/SettingsChildWrapperComponent'
import ProfileStats from 'js/components/Settings/Profile/ProfileStatsContainer'
import AuthUserComponent from 'js/components/General/AuthUserComponent'
import ErrorMessage from 'js/components/General/ErrorMessage'
import logger from 'js/utils/logger'

class ProfileStatsView extends React.Component {
  render() {
    return (
      <AuthUserComponent>
        <QueryRenderer
          environment={environment}
          query={graphql`
            query ProfileStatsViewQuery($userId: String!) {
              user(userId: $userId) {
                ...ProfileStatsContainer_user
              }
            }
          `}
          render={({ error, props }) => {
            if (error) {
              logger.error(error, error.source)
              const errMsg = 'We had a problem loading your stats :('
              return <ErrorMessage message={errMsg} />
            }
            const showError = this.props.showError
            const dataLoaded = !!props
            return (
              <SettingsChildWrapper loaded={dataLoaded}>
                {dataLoaded ? (
                  <ProfileStats user={props.user} showError={showError} />
                ) : null}
              </SettingsChildWrapper>
            )
          }}
        />
      </AuthUserComponent>
    )
  }
}

export default ProfileStatsView

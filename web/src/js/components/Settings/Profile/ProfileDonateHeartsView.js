/* global graphql */

import React from 'react'
import {QueryRenderer} from 'react-relay'
import environment from 'js/relay-env'

import SettingsChildWrapper from 'js/components/Settings/SettingsChildWrapperComponent'
import ProfileDonateHearts from 'js/components/Settings/Profile/ProfileDonateHeartsContainer'
import AuthUserComponent from 'js/components/General/AuthUserComponent'
import ErrorMessage from 'js/components/General/ErrorMessage'

class ProfileDonateHeartsView extends React.Component {
  render () {
    return (
      <AuthUserComponent>
        <QueryRenderer
          environment={environment}
          query={graphql`
            query ProfileDonateHeartsViewQuery($userId: String!) {
              app {
                ...ProfileDonateHeartsContainer_app
              }
              user(userId: $userId) {
                ...ProfileDonateHeartsContainer_user
              }
            }
          `}
          render={({error, props}) => {
            if (error) {
              console.error(error, error.source)
              const errMsg = 'We had a problem loading the Donate Hearts page.'
              return <ErrorMessage message={errMsg} />
            }
            const showError = this.props.showError
            const dataLoaded = !!props
            return (
              <SettingsChildWrapper loaded={dataLoaded}>
                { dataLoaded
                  ? (
                    <ProfileDonateHearts
                      app={props.app}
                      user={props.user}
                      showError={showError}
                    />
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

export default ProfileDonateHeartsView

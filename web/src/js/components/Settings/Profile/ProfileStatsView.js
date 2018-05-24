/* global graphql */

import React from 'react'
import {QueryRenderer} from 'react-relay/compat'
import environment from '../../../../relay-env'

import SettingsChildWrapper from '../SettingsChildWrapperComponent'
import ProfileStats from './ProfileStatsContainer'
import AuthUserComponent from 'general/AuthUserComponent'
import ErrorMessage from 'general/ErrorMessage'

class ProfileStatsView extends React.Component {
  render () {
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
          render={({error, props}) => {
            if (error) {
              console.error(error, error.source)
              const errMsg = 'We had a problem loading your stats :('
              return <ErrorMessage message={errMsg} />
            }
            const showError = this.props.showError
            const dataLoaded = !!props
            return (
              <SettingsChildWrapper loaded={dataLoaded}>
                { dataLoaded
                  ? (
                    <ProfileStats
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

export default ProfileStatsView

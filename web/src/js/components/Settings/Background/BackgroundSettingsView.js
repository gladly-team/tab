/* global graphql */

import React from 'react'
import {QueryRenderer} from 'react-relay/compat'
import environment from '../../../../relay-env'

import BackgroundSettings from './BackgroundSettingsContainer'

import FullScreenProgress from 'general/FullScreenProgress'
import AuthUserComponent from 'general/AuthUserComponent'
import ErrorMessage from 'general/ErrorMessage'

class BackgroundSettingsView extends React.Component {
  render () {
    return (
      <AuthUserComponent>
        <QueryRenderer
          environment={environment}
          query={graphql`
            query BackgroundSettingsViewQuery($userId: String!) {
              app {
                ...BackgroundSettingsContainer_app
              }
              user(userId: $userId) {
                ...BackgroundSettingsContainer_user
              }
            }
          `}
          render={({error, props}) => {
            if (error) {
              console.error(error, error.source)
              const errMsg = 'We had a problem loading the background settings :('
              return <ErrorMessage message={errMsg} />
            }

            if (props) {
              const showError = this.props.showError
              return (
                <BackgroundSettings
                  app={props.app}
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

export default BackgroundSettingsView

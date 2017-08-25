/* global graphql */

import React from 'react'
import {QueryRenderer} from 'react-relay/compat'
import environment from '../../../../relay-env'

import BackgroundSettings from './BackgroundSettingsContainer'

import FullScreenProgress from 'general/FullScreenProgress'
import AuthUserComponent from 'general/AuthUserComponent'

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
              // TODO: display visual error message.
              console.log('We had a problem loading the background settings :(')
              console.error(error, error.source)
              console.error(error.source)
              return null
            }

            if (props) {
              return (
                <BackgroundSettings
                  app={props.app}
                  user={props.user} />
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

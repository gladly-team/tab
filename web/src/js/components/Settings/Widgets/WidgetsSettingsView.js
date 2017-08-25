/* global graphql */

import React from 'react'
import {QueryRenderer} from 'react-relay/compat'
import environment from '../../../../relay-env'

import WidgetsSettings from './WidgetsSettingsContainer'

import FullScreenProgress from 'general/FullScreenProgress'
import AuthUserComponent from 'general/AuthUserComponent'

class WidgetsSettingsView extends React.Component {
  render () {
    return (
      <AuthUserComponent>
        <QueryRenderer
          environment={environment}
          query={graphql`
            query WidgetsSettingsViewQuery($userId: String!) {
              app {
                ...WidgetsSettingsContainer_app
              }
              user(userId: $userId) {
                ...WidgetsSettingsContainer_user
              }
            }
          `}
          render={({error, props}) => {
            if (error) {
              // TODO: display visual error message.
              console.log('We had a problem loading the widget settings :(')
              console.error(error, error.source)
              console.error(error.source)
              return null
            }

            if (props) {
              return (
                <WidgetsSettings
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

export default WidgetsSettingsView

/* global graphql */

import React from 'react'
import {QueryRenderer} from 'react-relay/compat'
import environment from '../../../../relay-env'

import WidgetsSettings from './WidgetsSettingsContainer'

import FullScreenProgress from 'general/FullScreenProgress'
import AuthUserComponent from 'general/AuthUserComponent'
import ErrorMessage from 'general/ErrorMessage'

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
              console.error(error, error.source)
              const errMsg = 'We had a problem loading the widget settings :('
              return <ErrorMessage message={errMsg} />
            }

            if (props) {
              const showError = this.props.showError
              return (
                <WidgetsSettings
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

export default WidgetsSettingsView

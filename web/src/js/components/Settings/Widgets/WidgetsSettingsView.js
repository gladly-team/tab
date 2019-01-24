import React from 'react'
import { QueryRenderer } from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import environment from 'js/relay-env'

import SettingsChildWrapper from 'js/components/Settings/SettingsChildWrapperComponent'
import WidgetsSettings from 'js/components/Settings/Widgets/WidgetsSettingsContainer'
import AuthUserComponent from 'js/components/General/AuthUserComponent'
import ErrorMessage from 'js/components/General/ErrorMessage'
import logger from 'js/utils/logger'

class WidgetsSettingsView extends React.Component {
  render() {
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
          render={({ error, props }) => {
            if (error) {
              logger.error(error, error.source)
              const errMsg = 'We had a problem loading the widget settings :('
              return <ErrorMessage message={errMsg} />
            }
            const showError = this.props.showError
            const dataLoaded = !!props
            return (
              <SettingsChildWrapper loaded={dataLoaded}>
                {dataLoaded ? (
                  <WidgetsSettings
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

export default WidgetsSettingsView

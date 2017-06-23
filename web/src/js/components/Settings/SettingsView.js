/* global graphql */

import React from 'react'
import {QueryRenderer} from 'react-relay/compat'
import environment from '../../../relay-env'

import FullScreenProgress from 'general/FullScreenProgress'
import AuthUserComponent from 'general/AuthUserComponent'

import Settigns from './SettingsContainer'

class SettingsView extends React.Component {
  render () {
    return (
      <AuthUserComponent>
        <QueryRenderer
          environment={environment}
          query={graphql`
            query SettingsViewQuery($userId: String!) {
              user(userId: $userId) {
                ...SettingsContainer_user
              }
            }
          `}
          render={({error, props}) => {
            if (error) {
              console.error(error)
              return
            }

            if (props) {
              return (
                <Settigns
                  user={props.user}
                  {...this.props}>
                  {this.props.children}
                </Settigns>
              )
            } else {
              return (<FullScreenProgress />)
            }
          }} />
      </AuthUserComponent>
    )
  }
}

export default SettingsView

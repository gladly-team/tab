/* global graphql */

import React from 'react'
import {QueryRenderer} from 'react-relay/compat'
import environment from '../../../relay-env'

import AuthUserComponent from 'general/AuthUserComponent'
import ErrorMessage from 'general/ErrorMessage'

import DashboardContainer from './DashboardContainer'

class DashboardView extends React.Component {
  render () {
    return (
      <AuthUserComponent>
        <QueryRenderer
          environment={environment}
          query={graphql`
            query DashboardViewQuery($userId: String!) {
              app {
                ...DashboardContainer_app
              }
              user(userId: $userId) {
                ...DashboardContainer_user
              }
            }
          `}
          render={({error, props}) => {
            if (error) {
              console.error(error, error.source)
              const errMsg = 'We had a problem loading your dashboard :('
              return <ErrorMessage message={errMsg} />
            }
            // TODO: render component before data returns.
            if (props) {
              // TODO: more precise props.
              return (
                <DashboardContainer app={props.app} user={props.user} />
              )
            } else {
              return null
            }
          }} />
      </AuthUserComponent>
    )
  }
}

export default DashboardView

/* global graphql */

import React from 'react'
import {QueryRenderer} from 'react-relay/compat'
import environment from '../../../relay-env'

import AuthUserComponent from 'general/AuthUserComponent'
import ErrorMessage from 'general/ErrorMessage'
import { pageview } from 'analytics/logEvent'

import DashboardContainer from './DashboardContainer'

class DashboardView extends React.Component {
  componentDidMount () {
    pageview()
  }

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
            if (!props) {
              props = {}
            }
            const app = props.app || null
            const user = props.user || null
            return (
              <DashboardContainer app={app} user={user} />
            )
          }} />
      </AuthUserComponent>
    )
  }
}

export default DashboardView

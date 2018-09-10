/* global graphql */

import React from 'react'
import { QueryRenderer } from 'react-relay/compat'
import environment from '../../../relay-env'

import AuthUserComponent from 'general/AuthUserComponent'
import ErrorMessage from 'general/ErrorMessage'

import DashboardContainer from './DashboardContainer'
import { createNewUser } from 'authentication/helpers'
import {
  goTo,
  loginURL
} from 'navigation/navigation'
import {
  ERROR_USER_DOES_NOT_EXIST
} from '../../constants'

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
          render={({ error, props, retry }) => {
            if (error) {
              // If any of the errors is because the user does not exist
              // on the server side, create the user and re-query if
              // possible. If it's not possible to create a new user,
              // redirect to the authentication page.
              const userDoesNotExistError = error.source.errors
                .some(err => err.code === ERROR_USER_DOES_NOT_EXIST)

              if (userDoesNotExistError) {
                createNewUser()
                  .then(user => {
                    retry()
                  })
                  .catch(e => {
                    goTo(loginURL)
                  })
              } else {
                const errMsg = 'We had a problem loading your dashboard :('
                return <ErrorMessage message={errMsg} />
              }
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

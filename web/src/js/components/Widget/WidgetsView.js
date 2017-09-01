/* global graphql */

import React from 'react'
import {QueryRenderer} from 'react-relay/compat'
import environment from '../../../relay-env'

import AuthUserComponent from 'general/AuthUserComponent'
import ErrorMessage from 'general/ErrorMessage'

import Widgets from './WidgetsContainer'

class WidgetsView extends React.Component {
  render () {
    return (
      <AuthUserComponent>
        <QueryRenderer
          environment={environment}
          query={graphql`
            query WidgetsViewQuery($userId: String!) {
              user(userId: $userId) {
                ...WidgetsContainer_user
              }
            }
          `}
          render={({error, props}) => {
            if (error) {
              console.error(error, error.source)
              const errMsg = 'We had a problem getting your widgets :('
              return <ErrorMessage message={errMsg} />
            }
            if (props) {
              const showError = this.props.showError
              return (
                <Widgets user={props.user} showError={showError} />
              )
            } else {
              return null
            }
          }} />
      </AuthUserComponent>
    )
  }
}

export default WidgetsView

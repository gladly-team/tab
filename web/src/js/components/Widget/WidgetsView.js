/* global graphql */

import React from 'react'
import {QueryRenderer} from 'react-relay/compat'
import environment from '../../../relay-env'

import AuthUserComponent from 'general/AuthUserComponent'

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
              // TODO: display visual error message.
              console.log('We had an error getting your widgets :(')
              console.error(error, error.source)
              console.error(error.source)
              return null
            }
            if (props) {
              return (
                <Widgets user={props.user} />
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

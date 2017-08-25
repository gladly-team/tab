/* global graphql */

import React from 'react'
import {QueryRenderer} from 'react-relay/compat'
import environment from '../../../relay-env'
import AuthUserComponent from 'general/AuthUserComponent'

import VcUserContainer from './VcUserContainer'

class VcUserView extends React.Component {
  render () {
    return (
      <AuthUserComponent>
        <QueryRenderer
          environment={environment}
          query={graphql`
            query VcUserViewQuery($userId: String!) {
              user(userId: $userId) {
                ...VcUserContainer_user
              }
            }
          `}
          render={({error, props}) => {
            if (error) {
              // TODO: display visual error message.
              console.log('We had a problem getting your Hearts and level count :(')
              console.error(error, error.source)
              console.error(error.source)
              return null
            }
            if (props) {
              return (
                <VcUserContainer user={props.user} />
              )
            } else {
              return null
            }
          }} />
      </AuthUserComponent>
    )
  }
}

export default VcUserView

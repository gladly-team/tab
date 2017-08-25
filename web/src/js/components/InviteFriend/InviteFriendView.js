/* global graphql */

import React from 'react'
import {QueryRenderer} from 'react-relay/compat'
import environment from '../../../relay-env'

import AuthUserComponent from 'general/AuthUserComponent'
import InviteFriend from './InviteFriendContainer'

class InviteFriendView extends React.Component {
  render () {
    return (
      <AuthUserComponent>
        <QueryRenderer
          environment={environment}
          query={graphql`
            query InviteFriendViewQuery($userId: String!) {
              user(userId: $userId) {
                ...InviteFriendContainer_user
              }
            }
          `}
          render={({error, props}) => {
            if (error) {
              // TODO: display visual error message.
              console.log('We had a problem getting your invite link :(')
              console.error(error, error.source)
              console.error(error.source)
              return null
            }

            return (
              <InviteFriend
                user={props ? props.user : null} />
            )
          }} />
      </AuthUserComponent>
    )
  }
}

export default InviteFriendView

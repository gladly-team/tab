/* global graphql */

import React from 'react'
import {QueryRenderer} from 'react-relay/compat'
import environment from '../../../relay-env'

import AuthUserComponent from 'general/AuthUserComponent'
import InviteFriend from './InviteFriendContainer'
import ErrorMessage from 'general/ErrorMessage'

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
              console.error(error, error.source)
              const errMsg = 'We had a problem getting your invite link :('
              return <ErrorMessage message={errMsg} />
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

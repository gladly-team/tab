/* global graphql */

import React from 'react'
import {QueryRenderer} from 'react-relay/compat'
import environment from '../../../../relay-env'

import ProfileDonateHearts from './ProfileDonateHeartsContainer'

import FullScreenProgress from 'general/FullScreenProgress'
import AuthUserComponent from 'general/AuthUserComponent'
import ErrorMessage from 'general/ErrorMessage'

class ProfileDonateHeartsView extends React.Component {
  render () {
    return (
      <AuthUserComponent>
        <QueryRenderer
          environment={environment}
          query={graphql`
            query ProfileDonateHeartsViewQuery($userId: String!) {
              user(userId: $userId) {
                ...ProfileDonateHeartsContainer_user
              }
            }
          `}
          render={({error, props}) => {
            if (error) {
              console.error(error, error.source)
              const errMsg = 'We had a problem loading your stats :('
              return <ErrorMessage message={errMsg} />
            }
            if (props) {
              const showError = this.props.showError
              return (
                <ProfileDonateHearts
                  user={props.user}
                  showError={showError} />
              )
            } else {
              return (<FullScreenProgress />)
            }
          }} />
      </AuthUserComponent>
    )
  }
}

export default ProfileDonateHeartsView

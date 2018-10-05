/* global graphql */

import React from 'react'
import {QueryRenderer} from 'react-relay'
import environment from '../../../../relay-env'
import SettingsChildWrapper from '../SettingsChildWrapperComponent'
import Account from './AccountContainer'
import AuthUserComponent from 'general/AuthUserComponent'
import ErrorMessage from 'general/ErrorMessage'

class AccountView extends React.Component {
  render () {
    return (
      <AuthUserComponent>
        <QueryRenderer
          environment={environment}
          query={graphql`
            query AccountViewQuery($userId: String!) {
              user(userId: $userId) {
                ...AccountContainer_user
              }
            }
          `}
          render={({error, props}) => {
            if (error) {
              console.error(error, error.source)
              const errMsg = 'We had a problem loading your account :('
              return <ErrorMessage message={errMsg} />
            }
            const showError = this.props.showError
            const dataLoaded = !!props
            return (
              <SettingsChildWrapper loaded={dataLoaded}>
                { dataLoaded
                  ? (
                    <Account
                      user={props.user}
                      showError={showError} />
                  )
                  : null
                }
              </SettingsChildWrapper>
            )
          }} />
      </AuthUserComponent>
    )
  }
}

export default AccountView

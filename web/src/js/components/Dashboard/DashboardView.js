import React from 'react'
import PropTypes from 'prop-types'
import graphql from 'babel-plugin-relay/macro'
import { QueryRenderer } from 'react-relay'
import { get } from 'lodash/object'
import environment from 'js/relay-env'

import ErrorMessage from 'js/components/General/ErrorMessage'
import DashboardContainer from 'js/components/Dashboard/DashboardContainer'
import { createNewUser } from 'js/authentication/helpers'
import { goTo, loginURL } from 'js/navigation/navigation'
import { ERROR_USER_DOES_NOT_EXIST } from 'js/constants'
import withUser from 'js/components/General/withUser'
import logger from 'js/utils/logger'
import { makePromiseCancelable } from 'js/utils/utils'

class DashboardView extends React.Component {
  constructor(props) {
    super(props)
    this.createNewUserPromise = null
  }

  componentWillUnmount() {
    if (this.createNewUserPromise && this.createNewUserPromise.cancel) {
      this.createNewUserPromise.cancel()
    }
  }

  render() {
    const { authUser } = this.props
    return (
      <div
        style={{
          height: '100%',
          width: '100%',
        }}
      >
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
          variables={{
            userId: authUser.id,
          }}
          render={({ error, props, retry }) => {
            if (error && get(error, 'source.errors')) {
              // If any of the errors is because the user does not exist
              // on the server side, create the user and re-query if
              // possible. If it's not possible to create a new user,
              // redirect to the authentication page.
              const userDoesNotExistError = error.source.errors.some(
                err => err.code === ERROR_USER_DOES_NOT_EXIST
              )

              if (userDoesNotExistError) {
                // Cancel new user creation on unmount.
                this.createNewUserPromise = makePromiseCancelable(
                  createNewUser()
                )
                this.createNewUserPromise.promise
                  .then(user => {
                    retry()
                  })
                  .catch(e => {
                    if (e && e.isCanceled) {
                      return
                    }
                    logger.error(e)
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
            return <DashboardContainer app={app} user={user} />
          }}
        />
      </div>
    )
  }
}

DashboardView.propTypes = {
  authUser: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
}

DashboardView.defaultProps = {}

export default withUser()(DashboardView)

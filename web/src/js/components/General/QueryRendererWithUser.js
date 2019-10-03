import React from 'react'
import PropTypes from 'prop-types'
import { QueryRenderer } from 'react-relay'
import { get } from 'lodash/object'
import { createNewUser } from 'js/authentication/helpers'
import { ERROR_USER_DOES_NOT_EXIST } from 'js/constants'
import logger from 'js/utils/logger'
import { makePromiseCancelable } from 'js/utils/utils'

const MAX_CREATE_USER_ATTEMPTS = 5

// Extend QueryRenderer to handle some common scenarios.
class QueryRendererWithUser extends React.Component {
  constructor(props) {
    super(props)
    this.createNewUserAttempts = 0
    this.createNewUserPromise = null
  }

  componentWillUnmount() {
    if (this.createNewUserPromise && this.createNewUserPromise.cancel) {
      this.createNewUserPromise.cancel()
    }
  }

  render() {
    const { render, ...otherProps } = this.props
    return (
      <QueryRenderer
        render={({ error, props, retry }) => {
          var errToPassToChild = error
          if (error && get(error, 'source.errors')) {
            // If any of the errors is because the user does not exist
            // on the server side, create the user and re-query if
            // possible.
            const userDoesNotExistError = error.source.errors.some(
              err => err.code === ERROR_USER_DOES_NOT_EXIST
            )

            // Limit the number of times we try to refetch a user after
            // trying to create the user to prevent a loop in case of
            // any bugs.
            if (
              userDoesNotExistError &&
              this.createNewUserAttempts < MAX_CREATE_USER_ATTEMPTS
            ) {
              // While we're trying to create the server-side user, don't
              // pass an error to the child.
              errToPassToChild = null

              this.createNewUserAttempts = this.createNewUserAttempts + 1

              // Cancel new user creation on unmount.
              this.createNewUserPromise = makePromiseCancelable(createNewUser())
              this.createNewUserPromise.promise
                .then(user => {
                  retry()
                })
                .catch(e => {
                  if (e && e.isCanceled) {
                    return
                  }
                  logger.error(e)
                })
            } else {
              logger.error(error)
            }
          }

          return render({ error: errToPassToChild, props, retry })
        }}
        {...otherProps}
      />
    )
  }
}

QueryRendererWithUser.propTypes = {
  render: PropTypes.func.isRequired,
}

QueryRendererWithUser.defaultProps = {}

export default QueryRendererWithUser

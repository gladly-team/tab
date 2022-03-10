import React from 'react'
import PropTypes from 'prop-types'
import gtag from 'js/analytics/google-analytics'

import { accountCreated } from 'js/analytics/logEvent'

class LogAccountCreation extends React.Component {
  componentDidMount() {
    const { user } = this.props

    // Set Google Analytics values that will be included on all events.
    // https://developers.google.com/tag-platform/gtagjs/reference#set
    // https://support.google.com/analytics/answer/11396839
    // This is a quick & dirty implementation to match v4:
    // https://github.com/gladly-team/tab-web/pull/302
    // Really, we'd want to hoist this up
    if (user) {
      gtag('set', 'user_properties', {
        ...(user.userId && {
          // The user's ID (not Relay global ID)
          tfac_user_id: user.userId,
        }),
      })
    }

    // If this is the user's first tab, log the "accountCreated"
    // analytics event. It's a little inefficient to fetch the user's
    // lifetime tabs count just for this purpose, so we may eventually
    // want to move this analytics event to another trigger.
    if (user && user.tabs === 0) {
      accountCreated()
    }
  }

  render() {
    return null
  }
}

LogAccountCreation.propTypes = {
  user: PropTypes.shape({
    userId: PropTypes.string.isRequired,
    tabs: PropTypes.number.isRequired,
  }).isRequired,
}

export default LogAccountCreation

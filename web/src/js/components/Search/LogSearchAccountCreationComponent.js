import React from 'react'
import PropTypes from 'prop-types'

import { searchForACauseAccountCreated } from 'js/analytics/logEvent'

class LogSearchAccountCreation extends React.Component {
  componentDidUpdate(prevProps) {
    const { user } = this.props

    // If this is the user's first search, log the "search account created"
    // analytics event. It's a little inefficient to fetch the user's
    // lifetime searches count just for this purpose, so we may eventually
    // want to move this analytics event to another trigger.
    if (user.searches === 1 && prevProps.user.searches === 0) {
      searchForACauseAccountCreated()
    }
  }

  render() {
    return null
  }
}

LogSearchAccountCreation.propTypes = {
  user: PropTypes.shape({
    searches: PropTypes.number.isRequired,
  }).isRequired,
}

export default LogSearchAccountCreation

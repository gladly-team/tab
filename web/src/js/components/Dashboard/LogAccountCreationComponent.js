import React from 'react'
import PropTypes from 'prop-types'

import { accountCreated } from 'js/analytics/logEvent'

class LogAccountCreation extends React.Component {
  componentDidMount() {
    const { user } = this.props

    // If this is the user's first tab, log the "accountCreated"
    // analytics event. It's a little inefficient to fetch the user's
    // lifetime tabs count just for this purpose, so we may eventually
    // want to move this analytics event to another trigger.
    if (user.tabs === 0) {
      accountCreated()
    }
  }

  render() {
    return null
  }
}

LogAccountCreation.propTypes = {
  user: PropTypes.shape({
    tabs: PropTypes.number.isRequired,
  }).isRequired,
}

export default LogAccountCreation

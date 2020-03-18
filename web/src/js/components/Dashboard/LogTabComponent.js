import React from 'react'
import LogTabMutation from 'js/mutations/LogTabMutation'
import PropTypes from 'prop-types'
import { incrementTabsOpenedToday } from 'js/utils/local-user-data-mgr'
import logger from 'js/utils/logger'

class LogTabComponent extends React.Component {
  componentDidMount() {
    // Delay so that:
    // * the user sees their VC increment
    // * ads are more likely to have loaded
    const LOG_TAB_DELAY = 1000
    setTimeout(() => {
      LogTabMutation(
        this.props.relay.environment,
        this.props.user.id,
        this.props.tabId
      ).catch(e => {
        logger.error(e)
      })
    }, LOG_TAB_DELAY)

    // Update today's tab count in localStorage.
    // This is useful when making rendering decisions before
    // we fetch user data from the server (e.g., whether we
    // should show ads or not).
    incrementTabsOpenedToday()
  }

  render() {
    return null
  }
}

LogTabComponent.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
  tabId: PropTypes.string.isRequired,
  relay: PropTypes.shape({
    environment: PropTypes.object.isRequired,
  }),
}

export default LogTabComponent

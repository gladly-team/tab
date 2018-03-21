import React from 'react'
import LogTabMutation from 'mutations/LogTabMutation'
import PropTypes from 'prop-types'

class LogTabComponent extends React.Component {
  componentDidMount () {
    console.log('tabId', this.props.tabId)
    // Delay so that:
    // * the user sees their VC increment
    // * ads are more likely to have loaded
    const LOG_TAB_DELAY = 1000
    setTimeout(() => {
      LogTabMutation.commit(
        this.props.relay.environment,
        this.props.user.id,
        this.props.tabId
      )
    }, LOG_TAB_DELAY)
  }

  render () {
    return null
  }
}

LogTabComponent.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired,
  tabId: PropTypes.string.isRequired,
  relay: PropTypes.shape({
    environment: PropTypes.object.isRequired
  })
}

export default LogTabComponent

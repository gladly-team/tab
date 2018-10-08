import React from 'react'
import PropTypes from 'prop-types'
import LogUserDataConsentMutation from 'js/mutations/LogUserDataConsentMutation'
import { isInEuropeanUnion } from 'js/utils/client-location'
import {
  checkIfNewConsentNeedsToBeLogged,
  getConsentString,
  hasGlobalConsent,
  markConsentDataAsLogged,
  registerConsentCallback,
  unregisterConsentCallback
} from 'ads/consentManagement'

class LogConsentDataComponent extends React.Component {
  constructor (props) {
    super(props)
    this.consentChangeCallback = null
  }

  async componentDidMount () {
    // Register a callback for any new consent updates.
    var isEU
    try {
      isEU = await isInEuropeanUnion()
    } catch (e) {
      isEU = false
    }
    if (isEU) {
      this.consentChangeCallback = this.logDataConsentDecision.bind(this)
      registerConsentCallback(this.consentChangeCallback)
    }

    // Check localStorage to see if we have any new consent
    // updates that haven't yet been logged (e.g. consent changes
    // when the user was not authenticated).
    if (checkIfNewConsentNeedsToBeLogged()) {
      const consentString = await getConsentString()
      const isGlobalConsent = await hasGlobalConsent()
      this.logDataConsentDecision(consentString, isGlobalConsent)
    }
  }

  componentWillUnmount () {
    if (this.consentChangeCallback) {
      unregisterConsentCallback(this.consentChangeCallback)
    }
  }

  logDataConsentDecision (consentString, isGlobalConsent) {
    const { relay, user } = this.props
    // If we're missing a consent string, don't log.
    if (!consentString) {
      return
    }

    const onCompleted = () => {
      markConsentDataAsLogged()
    }
    LogUserDataConsentMutation(
      relay.environment,
      user.id,
      consentString,
      isGlobalConsent,
      onCompleted
    )
  }

  render () {
    return null
  }
}

LogConsentDataComponent.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired,
  relay: PropTypes.shape({
    environment: PropTypes.object.isRequired
  })
}

export default LogConsentDataComponent

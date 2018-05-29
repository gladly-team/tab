import React from 'react'
import PropTypes from 'prop-types'
import LogUserDataConsentMutation from 'mutations/LogUserDataConsentMutation'
import { isInEuropeanUnion } from 'utils/client-location'
import {
  checkIfNewConsentNeedsToBeLogged,
  getConsentString,
  hasGlobalConsent,
  markConsentDataAsLogged,
  registerConsentCallback
} from 'ads/consentManagement'

class LogConsentDataComponent extends React.Component {
  async componentWillMount () {
    // Register a callback for any new consent updates.
    const isEU = await isInEuropeanUnion()
    if (isEU) {
      registerConsentCallback(this.handleDataConsentDecision.bind(this))
    }

    // Check localStorage to see if we have any new consent
    // updates that haven't yet been logged (e.g. consent changes
    // when the user was not authenticated).
    if (checkIfNewConsentNeedsToBeLogged()) {
      const consentString = await getConsentString()
      const isGlobalConsent = await hasGlobalConsent()
      await this.handleDataConsentDecision(consentString, isGlobalConsent)
    }
  }

  async handleDataConsentDecision (consentString, isGlobalConsent) {
    // Re-register the callback with Quantcast Choice so we can
    // handle any other consent changes on this same page view.
    // Quantcast Choice will not call this callback more than once.
    // "To invoke the callback every time the UI is shown, this
    // operation will need to be made before each time the UI is
    // brought up with __cmp('displayConsentUi')."
    // https://quantcast.zendesk.com/hc/en-us/articles/360003814853-Technical-Implementation-Guide
    registerConsentCallback(this.handleDataConsentDecision.bind(this))

    // If we're missing a consent string, don't log.
    if (!consentString) {
      return
    }

    const { relay, user } = this.props
    const onCompleted = () => {
      markConsentDataAsLogged()
    }

    // Mark that we're going to log the consent data and log it.
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

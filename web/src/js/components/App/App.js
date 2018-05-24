import React from 'react'
import withPageviewTracking from 'analytics/withPageviewTracking'
import { isInEuropeanUnion } from 'utils/client-location'
import {
  getConsentString,
  hasGlobalConsent,
  registerConsentCallback
} from 'ads/consentManagement'

class App extends React.Component {
  async componentWillMount () {
    const isEU = await isInEuropeanUnion()
    if (isEU) {
      registerConsentCallback(this.handleDataConsentDecision)
    }
  }

  async handleDataConsentDecision () {
    const consentString = await getConsentString()
    const isGlobalConsent = await hasGlobalConsent()

    // TODO
    // Log the consent data
    console.log('Data consent changed:', consentString, isGlobalConsent)
  }

  render () {
    const root = {
      width: '100%',
      height: '100%',
      boxSizing: 'border-box',
      margin: 0,
      padding: 0,
      border: 'none'
    }

    return (
      <div style={root}>
        {this.props.children}
      </div>
    )
  }
}

export default withPageviewTracking(App)

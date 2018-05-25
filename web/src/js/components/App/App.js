import React from 'react'
import withPageviewTracking from 'analytics/withPageviewTracking'
import { isInEuropeanUnion } from 'utils/client-location'
import {
  registerConsentCallback,
  saveConsentUpdateEventToLocalStorage
} from 'ads/consentManagement'

class App extends React.Component {
  async componentWillMount () {
    const isEU = await isInEuropeanUnion()
    if (isEU) {
      registerConsentCallback(this.handleDataConsentDecision.bind(this))
    }
  }

  async handleDataConsentDecision () {
    // Store the consent data. We'll log it to the server with
    // the user's ID after the user authenticates.
    saveConsentUpdateEventToLocalStorage()
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

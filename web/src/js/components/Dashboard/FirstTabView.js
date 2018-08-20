import React from 'react'
import {
  dashboardURL,
  replaceUrl
} from 'navigation/navigation'
import {
  setBrowserExtensionInstallTime
} from 'utils/local-user-data-mgr'

// The view the extensions open immediately after they're
// added to the browser.
class FirstTabView extends React.Component {
  componentDidMount () {
    // Here, we can do anything we need to do before
    // going to the main dashboard.

    // Set this as the user's installed time, which helps us
    // distinguish truly new users from returning users who
    // had cleared their local data.
    setBrowserExtensionInstallTime()

    // TODO
    // Add the user to an anonymous user test group, if anonymous
    // user testing is enabled.
    // tab.experiments.anonUser to "unauthed" or "auth-only"

    replaceUrl(dashboardURL)
  }

  render () {
    return <span />
  }
}

export default FirstTabView

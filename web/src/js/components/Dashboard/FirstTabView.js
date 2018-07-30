import React from 'react'
import {
  dashboardURL,
  replaceUrl
} from 'navigation/navigation'

// The view the extensions open immediately after they're
// added to the browser.
class FirstTabView extends React.Component {
  componentDidMount () {
    // Here, we can do anything we need to do before
    // going to the main dashboard.
    replaceUrl(dashboardURL)
  }

  render () {
    return <span />
  }
}

export default FirstTabView

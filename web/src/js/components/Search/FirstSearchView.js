import React from 'react'
import { replaceUrl, searchBaseURL } from 'js/navigation/navigation'

// The view the Search extensions open immediately after they're
// added to the browser.
class FirstSearchView extends React.Component {
  componentDidMount() {
    replaceUrl(searchBaseURL)
  }

  render() {
    return null
  }
}

export default FirstSearchView

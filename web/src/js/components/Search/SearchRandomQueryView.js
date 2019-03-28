import React from 'react'
import { goTo, searchBaseURL } from 'js/navigation/navigation'

// The browser extension opens this page when the user
// clicks on the browser extension icon. It selects a
// random pleasant search query and redirects to the
// search results.
class SearchRandomQueryView extends React.Component {
  componentDidMount() {
    goTo(searchBaseURL)
  }

  render() {
    return <span />
  }
}

export default SearchRandomQueryView

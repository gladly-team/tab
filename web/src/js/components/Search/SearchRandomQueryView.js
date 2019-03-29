import React from 'react'
import { goTo, searchBaseURL } from 'js/navigation/navigation'

// The browser extension opens this page when the user
// clicks on the browser extension icon. It selects a
// random pleasant search query and redirects to the
// search results.
class SearchRandomQueryView extends React.Component {
  componentDidMount() {
    const queries = [
      'volunteer opportunities near me',
      'how to have a bake sale for charity',
      'ways to raise money for non-profits',
      'random acts of kindness',
      'ways to make someone smile',
    ]
    const query = queries[Math.floor(Math.random() * queries.length)]
    goTo(searchBaseURL, {
      q: query,
    })
  }

  render() {
    return <span />
  }
}

export default SearchRandomQueryView

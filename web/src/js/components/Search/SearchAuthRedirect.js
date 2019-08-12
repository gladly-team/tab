import React from 'react'
import { replaceUrl, loginURL } from 'js/navigation/navigation'
import { SEARCH_APP } from 'js/constants'

// A convenience route to redirect /search/auth/ to
// /newtab/auth/?app=search.
class SearchAuthRedirect extends React.Component {
  componentDidMount() {
    replaceUrl(loginURL, { app: SEARCH_APP })
  }

  render() {
    return null
  }
}

export default SearchAuthRedirect

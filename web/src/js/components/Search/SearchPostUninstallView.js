import React from 'react'
import { searchPostUninstallSurveyURL } from 'js/navigation/navigation'
import { externalRedirect } from 'js/navigation/utils'

// The view the search extension opens immediately after the
// user uninstalls the extension.
class SearchPostUninstallView extends React.Component {
  componentDidMount() {
    externalRedirect(searchPostUninstallSurveyURL)
  }

  render() {
    return <span />
  }
}

export default SearchPostUninstallView

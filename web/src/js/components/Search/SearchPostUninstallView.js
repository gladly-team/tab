import React from 'react'
import { searchPostUninstallSurveyURL } from 'js/navigation/navigation'
import { goTo } from 'js/navigation/navigation'

// The view the search extension opens immediately after the
// user uninstalls the extension.
class SearchPostUninstallView extends React.Component {
  componentDidMount() {
    goTo(searchPostUninstallSurveyURL)
  }

  render() {
    return <span />
  }
}

export default SearchPostUninstallView

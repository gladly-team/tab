import React from 'react'
import { postUninstallSurveyURL } from 'js/navigation/navigation'
import { goTo } from 'js/navigation/navigation'

// The view the extensions open immediately after the
// user uninstalls the extension.
class PostUninstallView extends React.Component {
  componentDidMount() {
    goTo(postUninstallSurveyURL)
  }

  render() {
    return <span />
  }
}

export default PostUninstallView

import React from 'react'
import {
  externalRedirect,
  postUninstallSurveyURL
} from 'js/navigation/navigation'

// The view the extensions open immediately after the
// user uninstalls the extension.
class PostUninstallView extends React.Component {
  componentDidMount () {
    externalRedirect(postUninstallSurveyURL)
  }

  render () {
    return <span />
  }
}

export default PostUninstallView

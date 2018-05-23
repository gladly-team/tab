import React from 'react'
import FadeInAnimation from 'general/FadeInAnimation'

// TODO: consolidate progress loader logic here with a "dataLoaded"
// component for all settings sub-views. Currently, each settings
// view is handling its own loader.
// TODO: style to fill remaining space so that the loader can be
// centered without using vh or vw.
class SettingsChildWrapper extends React.Component {
  render () {
    const container = {
      padding: 20
    }
    return (
      <FadeInAnimation>
        <div style={container}>
          {this.props.children}
        </div>
      </FadeInAnimation>
    )
  }
}

export default SettingsChildWrapper

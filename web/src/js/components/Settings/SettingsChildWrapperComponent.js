import React from 'react'
import FadeInAnimation from 'general/FadeInAnimation'

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

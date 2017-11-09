import React from 'react'
import FadeInAnimation from 'general/FadeInAnimation'

class SettingsChildWrapper extends React.Component {
  render () {
    const container = {
      marginLeft: 256,
      marginRight: 'auto',
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

import React from 'react'
import SettingsPageComponent from './SettingsPageComponent'

class Settings extends React.Component {
  render () {
    return (
      <SettingsPageComponent
        title={'Settings'}
      >
        {this.props.children}
      </SettingsPageComponent>
    )
  }
}

export default Settings

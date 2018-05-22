import React from 'react'
import SettingsPageComponent from './SettingsPageComponent'

class Profile extends React.Component {
  render () {
    return (
      <SettingsPageComponent
        title={'Your Profile'}
      >
        {this.props.children}
      </SettingsPageComponent>
    )
  }
}

export default Profile

import React from 'react'
import Divider from 'material-ui/Divider'
import SettingsPageComponent from './SettingsPageComponent'
import SettingsMenuItem from './SettingsMenuItem'

class Profile extends React.Component {
  render () {
    return (
      <SettingsPageComponent
        title={'Your Profile'}
        menuItems={[
          <SettingsMenuItem
            key={'stats'}
            to={'/tab/profile/stats/'}>
              Your Stats
          </SettingsMenuItem>,
          <SettingsMenuItem
            key={'donate'}
            to={'/tab/profile/donate/'}>
              Donate Hearts
          </SettingsMenuItem>,
          <SettingsMenuItem
            key={'invite'}
            to={'/tab/profile/invite/'}>
              Invite Friends
          </SettingsMenuItem>,
          <Divider key={'divider'} />,
          <SettingsMenuItem
            key={'settings'}
            to={'/tab/settings/widgets/'}>
              Settings
          </SettingsMenuItem>
        ]}
      >
        {this.props.children}
      </SettingsPageComponent>
    )
  }
}

export default Profile

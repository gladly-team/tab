import React from 'react'
import Divider from 'material-ui/Divider'
import SettingsPageComponent from './SettingsPageComponent'
import SettingsMenuItem from './SettingsMenuItem'
import {
  donateURL,
  inviteFriendsURL,
  statsURL,
  settingsURL
} from 'navigation/navigation'

class Profile extends React.Component {
  render () {
    return (
      <SettingsPageComponent
        title={'Your Profile'}
        menuItems={[
          <SettingsMenuItem
            key={'stats'}
            to={statsURL}>
              Your Stats
          </SettingsMenuItem>,
          <SettingsMenuItem
            key={'donate'}
            to={donateURL}>
              Donate Hearts
          </SettingsMenuItem>,
          <SettingsMenuItem
            key={'invite'}
            to={inviteFriendsURL}>
              Invite Friends
          </SettingsMenuItem>,
          <Divider key={'divider'} />,
          <SettingsMenuItem
            key={'settings'}
            to={settingsURL}>
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

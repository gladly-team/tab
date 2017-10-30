import React from 'react'
import {
  goToLogin
} from 'navigation/navigation'
import Divider from 'material-ui/Divider'
import ExitToAppIcon from 'material-ui/svg-icons/action/exit-to-app'
import FlatButton from 'material-ui/FlatButton'
import SettingsPageComponent from './SettingsPageComponent'
import SettingsMenuItem from './SettingsMenuItem'
import { logoutUser } from '../../utils/cognito-auth'
import appTheme from 'theme/default'

class Profile extends React.Component {
  logout () {
    logoutUser((loggedOut) => {
      if (loggedOut) {
        goToLogin()
      }
    })
  }

  render () {
    const dividerStyle = {
      marginLeft: 14,
      marginRight: 14
    }
    const logoutButtonStyle = {
      color: appTheme.palette.accent1Color,
      bottom: 20,
      left: 60
    }
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
          <Divider key={'divider'} style={dividerStyle} />,
          <SettingsMenuItem
            key={'settings'}
            to={'/tab/settings/widgets/'}>
              Settings
          </SettingsMenuItem>
        ]}
        menuItemBottom={
          <FlatButton
            id={'app-signout-btn'}
            onClick={this.logout.bind(this)}
            label='Sign Out'
            labelPosition='before'
            style={logoutButtonStyle}
            icon={
              <ExitToAppIcon
                color={appTheme.palette.accent1Color}
              />
            }
          />
        }
      >
        {this.props.children}
      </SettingsPageComponent>
    )
  }
}

export default Profile

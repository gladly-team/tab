import React from 'react'
import {
  goToLogin
} from 'navigation/navigation'
import FontIcon from 'material-ui/FontIcon'
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
          </SettingsMenuItem>
        ]}
        menuItemBottom={
          <FlatButton
            id={'app-signout-btn'}
            onClick={this.logout.bind(this)}
            label='Sign Out'
            labelPosition='before'
            style={logoutButtonStyle}
            icon={<FontIcon
              color={appTheme.palette.accent1Color}
              className='fa fa-sign-out' />} />
        }
      >
        {this.props.children}
      </SettingsPageComponent>
    )
  }
}

export default Profile

import React from 'react'
import PropTypes from 'prop-types'
import {
  goToLogin
} from 'navigation/navigation'
import Divider from 'material-ui/Divider'
import FontIcon from 'material-ui/FontIcon'
import FlatButton from 'material-ui/FlatButton'
import SettingsPageComponent from './SettingsPageComponent'
import SettingsMenuItem from './SettingsMenuItem'
import { logoutUser } from '../../utils/cognito-auth'
import appTheme from 'theme/default'

class Settings extends React.Component {
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
        title={'Settings'}
        menuItems={[
          <SettingsMenuItem
            key={'widgets'}
            to={'/tab/settings/widgets/'}>
              Widgets
          </SettingsMenuItem>,
          <SettingsMenuItem
            key={'background'}
            to={'/tab/settings/background/'}>
              Background
          </SettingsMenuItem>,
          <Divider style={dividerStyle} />,
          <SettingsMenuItem
            key={'profile'}
            to={'/tab/profile/stats/'}>
              Your Profile
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

Settings.propTypes = {
  style: PropTypes.object
}

Settings.defaultProps = {
  style: {}
}

export default Settings

import React from 'react'
import PropTypes from 'prop-types'
import Divider from 'material-ui/Divider'
import SettingsPageComponent from './SettingsPageComponent'
import SettingsMenuItem from './SettingsMenuItem'

class Settings extends React.Component {
  render () {
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
          <Divider key={'divider'} />,
          <SettingsMenuItem
            key={'profile'}
            to={'/tab/profile/stats/'}>
              Your Profile
          </SettingsMenuItem>
        ]}
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

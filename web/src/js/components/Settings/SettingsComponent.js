import React from 'react'
import PropTypes from 'prop-types'
import Divider from 'material-ui/Divider'
import SettingsPageComponent from './SettingsPageComponent'
import SettingsMenuItem from './SettingsMenuItem'
import {
  backgroundSettingsURL,
  statsURL,
  widgetSettingsURL
} from 'navigation/navigation'

class Settings extends React.Component {
  render () {
    return (
      <SettingsPageComponent
        title={'Settings'}
        menuItems={[
          <SettingsMenuItem
            key={'widgets'}
            to={widgetSettingsURL}>
              Widgets
          </SettingsMenuItem>,
          <SettingsMenuItem
            key={'background'}
            to={backgroundSettingsURL}>
              Background
          </SettingsMenuItem>,
          <Divider key={'divider'} />,
          <SettingsMenuItem
            key={'profile'}
            to={statsURL}>
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

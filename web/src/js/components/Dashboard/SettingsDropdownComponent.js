import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
// import Typography from '@material-ui/core/Typography'
// import Button from '@material-ui/core/Button'
// import Divider from '@material-ui/core/Divider'
// import HeartBorderIcon from '@material-ui/icons/FavoriteBorder'
import DashboardPopover from 'js/components/Dashboard/DashboardPopover'
// import { inviteFriendsURL, donateURL } from 'js/navigation/navigation'
// import Link from 'js/components/General/Link'

import Divider from 'material-ui/Divider'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import HeartIcon from 'material-ui/svg-icons/action/favorite'
import SettingsIcon from 'material-ui/svg-icons/action/settings'
import HelpIcon from 'material-ui/svg-icons/action/help'
import PersonAddIcon from 'material-ui/svg-icons/social/person-add'
import ChartIcon from 'material-ui/svg-icons/editor/insert-chart'
import ExitToAppIcon from 'material-ui/svg-icons/action/exit-to-app'
import {
  goToInviteFriends,
  goToDonate,
  goToSettings,
  goToStats,
} from 'js/navigation/navigation'
import appTheme from 'js/theme/default'

// TODO: break out to make the component customizable:
// https://material-ui.com/customization/overrides/#3-specific-variation-of-a-component
const styles = {
  typographyRoot: {
    color: 'white',
  },
  dividerRoot: {
    backgroundColor: 'rgba(255, 255, 255, 0.20)',
  },
  heartIconRoot: {
    color: 'white',
  },
}

const SettingsDropdownComponent = props => {
  const { anchorElement, isUserAnonymous, onClose, onLogoutClick, open } = props

  const menuWidth = 200
  const menuStyle = {
    width: menuWidth,
    overflowX: 'hidden',
    backgroundColor: 'transparent',
    fontFamily: appTheme.fontFamily,
  }
  const menuItemStyle = {
    fontSize: 14,
    color: appTheme.palette.alternateTextColor,
  }
  const menuItemIconColor = '#FFFFFF'
  const menuItemSvgIconStyle = {
    color: menuItemIconColor,
    height: 22,
    width: 22,
  }
  return (
    <DashboardPopover open={open} anchorEl={anchorElement} onClose={onClose}>
      <Menu
        width={menuWidth}
        autoWidth={false}
        style={menuStyle}
        menuItemStyle={menuItemStyle}
      >
        <MenuItem
          primaryText="Settings"
          onClick={goToSettings}
          leftIcon={
            <SettingsIcon
              color={menuItemIconColor}
              style={menuItemSvgIconStyle}
            />
          }
        />
        <MenuItem
          primaryText="Donate Hearts"
          onClick={goToDonate}
          leftIcon={
            <HeartIcon color={menuItemIconColor} style={menuItemSvgIconStyle} />
          }
        />
        <MenuItem
          primaryText="Invite Friends"
          onClick={goToInviteFriends}
          leftIcon={
            <PersonAddIcon
              color={menuItemIconColor}
              style={menuItemSvgIconStyle}
            />
          }
        />
        <MenuItem
          primaryText="Your Stats"
          onClick={goToStats}
          leftIcon={
            <ChartIcon color={menuItemIconColor} style={menuItemSvgIconStyle} />
          }
        />
        <Divider style={{ marginBottom: 0, marginTop: 0 }} />
        <a
          href="https://gladly.zendesk.com/hc/en-us/categories/201939608-Tab-for-a-Cause"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: menuItemIconColor,
            textDecoration: 'none',
          }}
        >
          <MenuItem
            primaryText="Help"
            onClick={goToStats}
            leftIcon={
              <HelpIcon
                color={menuItemIconColor}
                style={menuItemSvgIconStyle}
              />
            }
            style={menuItemStyle}
          />
        </a>
        {!isUserAnonymous ? (
          <Divider style={{ marginBottom: 0, marginTop: 0 }} />
        ) : null}
        {!isUserAnonymous ? (
          <MenuItem
            primaryText="Sign Out"
            onClick={onLogoutClick}
            data-test-id={'app-menu-sign-out'}
            leftIcon={
              <ExitToAppIcon
                color={menuItemIconColor}
                style={menuItemSvgIconStyle}
              />
            }
          />
        ) : null}
      </Menu>
    </DashboardPopover>
  )
}

SettingsDropdownComponent.displayNamae = 'SettingsDropdownComponent'

SettingsDropdownComponent.propTypes = {
  anchorElement: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  classes: PropTypes.object.isRequired,
  isUserAnonymous: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onLogoutClick: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
}

SettingsDropdownComponent.defaultProps = {
  open: false,
}

export default withStyles(styles)(SettingsDropdownComponent)

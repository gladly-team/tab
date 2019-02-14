import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import MenuList from '@material-ui/core/MenuList'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
// import Typography from '@material-ui/core/Typography'
// import Button from '@material-ui/core/Button'
// import Divider from '@material-ui/core/Divider'
// import HeartBorderIcon from '@material-ui/icons/FavoriteBorder'
import DashboardPopover from 'js/components/Dashboard/DashboardPopover'
// import { inviteFriendsURL, donateURL } from 'js/navigation/navigation'
// import Link from 'js/components/General/Link'

import Divider from 'material-ui/Divider'
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

  const menuItemIconColor = '#FFFFFF'
  const menuItemSvgIconStyle = {
    color: menuItemIconColor,
    height: 22,
    width: 22,
  }
  return (
    <DashboardPopover open={open} anchorEl={anchorElement} onClose={onClose}>
      <MenuList style={{ width: 200 }}>
        <MenuItem onClick={goToSettings}>
          <ListItemIcon>
            <SettingsIcon
              color={menuItemIconColor}
              style={menuItemSvgIconStyle}
            />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>
        <MenuItem onClick={goToDonate}>
          <ListItemIcon>
            <HeartIcon color={menuItemIconColor} style={menuItemSvgIconStyle} />
          </ListItemIcon>
          <ListItemText>Donate Hearts</ListItemText>
        </MenuItem>
        <MenuItem onClick={goToInviteFriends}>
          <ListItemIcon>
            <PersonAddIcon
              color={menuItemIconColor}
              style={menuItemSvgIconStyle}
            />
          </ListItemIcon>
          <ListItemText>Invite Friends</ListItemText>
        </MenuItem>
        <MenuItem onClick={goToStats}>
          <ListItemIcon>
            <ChartIcon color={menuItemIconColor} style={menuItemSvgIconStyle} />
          </ListItemIcon>
          <ListItemText>Your Stats</ListItemText>
        </MenuItem>
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
          <MenuItem onClick={goToStats}>
            <ListItemIcon>
              <HelpIcon
                color={menuItemIconColor}
                style={menuItemSvgIconStyle}
              />
            </ListItemIcon>
            <ListItemText>Help</ListItemText>
          </MenuItem>
        </a>
        {!isUserAnonymous ? (
          <Divider style={{ marginBottom: 0, marginTop: 0 }} />
        ) : null}
        {!isUserAnonymous ? (
          <MenuItem onClick={onLogoutClick} data-test-id={'app-menu-sign-out'}>
            <ListItemIcon>
              <ExitToAppIcon
                color={menuItemIconColor}
                style={menuItemSvgIconStyle}
              />
            </ListItemIcon>
            <ListItemText>Sign Out</ListItemText>
          </MenuItem>
        ) : null}
      </MenuList>
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

import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import MenuList from '@material-ui/core/MenuList'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import HeartIcon from '@material-ui/icons/Favorite'
import SettingsIcon from '@material-ui/icons/Settings'
import HelpIcon from '@material-ui/icons/Help'
import PersonAddIcon from '@material-ui/icons/PersonAdd'
import ChartIcon from '@material-ui/icons/InsertChart'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import DashboardPopover from 'js/components/Dashboard/DashboardPopover'
// import { inviteFriendsURL, donateURL } from 'js/navigation/navigation'
// import Link from 'js/components/General/Link'

import {
  goToInviteFriends,
  goToDonate,
  goToSettings,
  goToStats,
} from 'js/navigation/navigation'

// TODO: break out to make the component customizable:
// https://material-ui.com/customization/overrides/#3-specific-variation-of-a-component
const fontColor = 'white'
const styles = {
  // https://material-ui.com/demos/menus/#customized-menuitem
  listItemTextPrimary: {
    color: fontColor,
  },
  icon: {
    color: fontColor,
    fontSize: 22,
  },
  divider: {
    backgroundColor: 'rgba(255, 255, 255, 0.20)',
  },
}

const SettingsDropdownComponent = props => {
  const {
    anchorElement,
    classes,
    isUserAnonymous,
    onClose,
    onLogoutClick,
    open,
  } = props

  return (
    <DashboardPopover open={open} anchorEl={anchorElement} onClose={onClose}>
      <MenuList style={{ width: 200 }}>
        <MenuItem onClick={goToSettings}>
          <ListItemIcon>
            <SettingsIcon className={classes.icon} />
          </ListItemIcon>
          <ListItemText
            classes={{ primary: classes.listItemTextPrimary }}
            primaryTypographyProps={{ variant: 'body2' }}
          >
            Settings
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={goToDonate}>
          <ListItemIcon>
            <HeartIcon className={classes.icon} />
          </ListItemIcon>
          <ListItemText
            classes={{ primary: classes.listItemTextPrimary }}
            primaryTypographyProps={{ variant: 'body2' }}
          >
            Donate Hearts
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={goToInviteFriends}>
          <ListItemIcon>
            <PersonAddIcon className={classes.icon} />
          </ListItemIcon>
          <ListItemText
            classes={{ primary: classes.listItemTextPrimary }}
            primaryTypographyProps={{ variant: 'body2' }}
          >
            Invite Friends
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={goToStats}>
          <ListItemIcon>
            <ChartIcon className={classes.icon} />
          </ListItemIcon>
          <ListItemText
            classes={{ primary: classes.listItemTextPrimary }}
            primaryTypographyProps={{ variant: 'body2' }}
          >
            Your Stats
          </ListItemText>
        </MenuItem>
        <Divider className={classes.divider} />
        <a
          href="https://gladly.zendesk.com/hc/en-us/categories/201939608-Tab-for-a-Cause"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            // color: menuItemIconColor,
            textDecoration: 'none',
          }}
        >
          <MenuItem onClick={goToStats}>
            <ListItemIcon>
              <HelpIcon className={classes.icon} />
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.listItemTextPrimary }}
              primaryTypographyProps={{ variant: 'body2' }}
            >
              Help
            </ListItemText>
          </MenuItem>
        </a>
        {!isUserAnonymous ? <Divider className={classes.divider} /> : null}
        {!isUserAnonymous ? (
          <MenuItem onClick={onLogoutClick} data-test-id={'app-menu-sign-out'}>
            <ListItemIcon>
              <ExitToAppIcon className={classes.icon} />
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.listItemTextPrimary }}
              primaryTypographyProps={{ variant: 'body2' }}
            >
              Sign Out
            </ListItemText>
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

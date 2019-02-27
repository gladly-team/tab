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
import Link from 'js/components/General/Link'
import {
  goTo,
  donateURL,
  inviteFriendsURL,
  externalHelpURL,
  settingsURL,
  statsURL,
} from 'js/navigation/navigation'

const styles = {
  // https://material-ui.com/demos/menus/#customized-menuitem
  listItemTextPrimary: {},
  icon: {
    fontSize: 22,
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
        <MenuItem
          onClick={() => {
            goTo(settingsURL)
          }}
        >
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
        <MenuItem
          onClick={() => {
            goTo(donateURL)
          }}
        >
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
        <MenuItem
          onClick={() => {
            goTo(inviteFriendsURL)
          }}
        >
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
        <MenuItem
          onClick={() => {
            goTo(statsURL)
          }}
        >
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
        <Divider />
        <Link to={externalHelpURL} target="_blank">
          <MenuItem>
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
        </Link>
        {!isUserAnonymous ? <Divider /> : null}
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

SettingsDropdownComponent.displayName = 'SettingsDropdownComponent'

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

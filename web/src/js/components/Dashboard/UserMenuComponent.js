import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import CircleIcon from '@material-ui/icons/Lens'
import { logout } from 'js/authentication/user'
import { goToLogin } from 'js/navigation/navigation'
import logger from 'js/utils/logger'
import MoneyRaised from 'js/components/MoneyRaised/MoneyRaisedContainer'
import Hearts from 'js/components/Dashboard/HeartsContainer'
import SettingsDropdown from 'js/components/Dashboard/SettingsDropdownComponent'

const fontColor = 'rgba(255, 255, 255, 0.8)'
const fontColorActive = 'white'
const styles = {
  circleIcon: {
    color: fontColor,
    alignSelf: 'center',
    width: 5,
    height: 5,
    marginTop: 2,
    marginLeft: 12,
    marginRight: 12,
  },
  settingsIcon: {
    color: fontColor,
    padding: 0,
    width: 40,
    height: 40,
    transition: 'color 300ms ease-in',
    fontSize: 22,
    '&:hover': {
      color: fontColorActive,
      backgroundColor: 'transparent',
    },
  },
}

class UserMenu extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      menuIconHover: false,
      menuOpen: false,
      menuPopoverAnchorElem: null,
    }
  }

  async logout() {
    var logoutSuccess = false
    try {
      logoutSuccess = await logout()
    } catch (e) {
      logger.error(e)
    }
    if (logoutSuccess) {
      goToLogin()
    }
  }

  onMenuClick(event) {
    this.setState({
      menuOpen: !this.state.open,
      menuPopoverAnchorElem: event.currentTarget,
    })
  }

  handleMenuPopoverClose() {
    this.setState({
      menuOpen: false,
    })
  }

  onMenuIconHover(hovering) {
    this.setState({
      menuIconHover: hovering,
    })
  }

  onHover(hovering) {
    this.setState({
      hover: hovering,
    })
  }

  render() {
    const { app, classes, user, isUserAnonymous } = this.props
    const { menuOpen, menuPopoverAnchorElem } = this.state
    if (!user || !app) {
      return null
    }

    // TODO: move settings icon into its own component
    // TODO: add more tests for UserMenu
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <MoneyRaised app={app} />
        <CircleIcon className={classes.circleIcon} />
        <Hearts app={app} user={user} />
        <IconButton
          data-test-id={'app-menu-icon'}
          data-tour-id={'settings-button'}
          className={classes.settingsIcon}
          onMouseEnter={this.onMenuIconHover.bind(this, true)}
          onMouseLeave={this.onMenuIconHover.bind(this, false)}
          onClick={this.onMenuClick.bind(this)}
        >
          <MoreVertIcon />
        </IconButton>
        <SettingsDropdown
          open={menuOpen}
          anchorElement={menuPopoverAnchorElem}
          onClose={this.handleMenuPopoverClose.bind(this)}
          onLogoutClick={this.logout.bind(this)}
          isUserAnonymous={isUserAnonymous}
        />
      </div>
    )
  }
}

// TODO: remove data this component doesn't use
UserMenu.propTypes = {
  app: PropTypes.shape({
    referralVcReward: PropTypes.number.isRequired,
  }),
  classes: PropTypes.object.isRequired,
  isUserAnonymous: PropTypes.bool,
  style: PropTypes.object,
  user: PropTypes.shape({
    vcCurrent: PropTypes.number.isRequired,
    level: PropTypes.number.isRequired,
    heartsUntilNextLevel: PropTypes.number.isRequired,
    vcDonatedAllTime: PropTypes.number.isRequired,
    numUsersRecruited: PropTypes.number.isRequired,
    tabsToday: PropTypes.number.isRequired,
  }),
}

UserMenu.defaultProps = {
  isUserAnonymous: false,
  style: {},
}

export default withStyles(styles)(UserMenu)

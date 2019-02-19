import React from 'react'
import PropTypes from 'prop-types'
import IconButton from 'material-ui/IconButton'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import { logout } from 'js/authentication/user'
import { goToLogin } from 'js/navigation/navigation'
import {
  dashboardIconActiveColor,
  dashboardIconInactiveColor,
} from 'js/theme/default'
import logger from 'js/utils/logger'
import Hearts from 'js/components/Dashboard/HeartsContainer'
import SettingsDropdown from 'js/components/Dashboard/SettingsDropdownComponent'

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
    const { app, user, isUserAnonymous } = this.props
    const { menuOpen, menuPopoverAnchorElem } = this.state
    if (!user || !app) {
      return null
    }
    const userMenuStyle = {
      display: 'flex',
      alignItems: 'center',
    }

    // Menu style
    const menuIconButtonStyle = {
      padding: 0,
      width: 40,
      height: 40,
    }
    const menuIconStyle = {
      color: this.state.menuIconHover
        ? dashboardIconActiveColor
        : dashboardIconInactiveColor,
      transition: 'color 300ms ease-in',
      fontSize: 22,
    }

    // TODO: add level bar
    return (
      <div style={userMenuStyle}>
        <Hearts app={app} user={user} />
        <IconButton
          style={menuIconButtonStyle}
          iconStyle={menuIconStyle}
          onMouseEnter={this.onMenuIconHover.bind(this, true)}
          onMouseLeave={this.onMenuIconHover.bind(this, false)}
          onClick={this.onMenuClick.bind(this)}
          data-test-id={'app-menu-icon'}
          data-tour-id={'settings-button'}
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
  user: PropTypes.shape({
    vcCurrent: PropTypes.number.isRequired,
    level: PropTypes.number.isRequired,
    heartsUntilNextLevel: PropTypes.number.isRequired,
    vcDonatedAllTime: PropTypes.number.isRequired,
    numUsersRecruited: PropTypes.number.isRequired,
    tabsToday: PropTypes.number.isRequired,
  }),
  isUserAnonymous: PropTypes.bool,
  style: PropTypes.object,
}

UserMenu.defaultProps = {
  isUserAnonymous: false,
  style: {},
}

export default UserMenu

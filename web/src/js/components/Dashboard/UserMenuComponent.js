import React from 'react'
import PropTypes from 'prop-types'
import DashboardPopover from 'js/components/Dashboard/DashboardPopover'
import Divider from 'material-ui/Divider'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton'
import HeartIcon from 'material-ui/svg-icons/action/favorite'
import HeartBorderIcon from 'material-ui/svg-icons/action/favorite-border'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import SettingsIcon from 'material-ui/svg-icons/action/settings'
import HelpIcon from 'material-ui/svg-icons/action/help'
import PersonAddIcon from 'material-ui/svg-icons/social/person-add'
import ChartIcon from 'material-ui/svg-icons/editor/insert-chart'
import CheckmarkIcon from 'material-ui/svg-icons/action/done'
import ExitToAppIcon from 'material-ui/svg-icons/action/exit-to-app'
import {
  goToInviteFriends,
  goToDonate,
  goToLogin,
  goToSettings,
  goToStats,
} from 'js/navigation/navigation'
import { logout } from 'js/authentication/user'
import appTheme, {
  dashboardIconActiveColor,
  dashboardIconInactiveColor,
} from 'js/theme/default'
import { commaFormatted } from 'js/utils/utils'
import { MAX_DAILY_HEARTS_FROM_TABS } from 'js/constants'
import logger from 'js/utils/logger'
import HeartsDropdown from 'js/components/Dashboard/HeartsDropdownContainer'

class UserMenu extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      heartsHover: false,
      heartsPopoverOpen: false,
      menuIconHover: false,
      menuOpen: false,
      // refs
      heartsPopoverAnchorElem: null,
      heartsHoverPopoverAnchorElem: null,
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

  onHeartsHover(hovering, event) {
    this.setState({
      heartsHover: hovering,
      heartsHoverPopoverAnchorElem: event.currentTarget,
    })
  }

  onHeartsClick(event) {
    this.setState({
      heartsPopoverOpen: !this.state.open,
      heartsPopoverAnchorElem: event.currentTarget,
    })
  }

  handleHeartsPopoverClose() {
    this.setState({
      heartsPopoverOpen: false,
    })
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
    if (!user || !app) {
      return null
    }

    const heartsPopoverStyle = {
      textAlign: 'center',
      width: 210,
    }

    const userMenuStyle = {
      display: 'flex',
      alignItems: 'center',
    }

    // Hearts style
    const textStyle = Object.assign(
      {},
      {
        color: this.state.heartsHover
          ? dashboardIconActiveColor
          : dashboardIconInactiveColor,
        transition: 'color 300ms ease-in',
        fontSize: 18,
        fontWeight: 'normal',
        fontFamily: appTheme.fontFamily,
        userSelect: 'none',
        cursor: 'pointer',
      },
      this.props.style
    )
    const heartsStyle = Object.assign({}, textStyle, {
      marginRight: 0,
      display: 'flex',
      alignItems: 'center',
    })

    // Menu style
    const menuWidth = 200
    const menuPopoverStyle = {
      padding: 0,
      width: menuWidth,
    }
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

    // Used to let the user know they aren't earning any more
    // Hearts from tabs today.
    const reachedMaxDailyHearts = user.tabsToday >= MAX_DAILY_HEARTS_FROM_TABS

    // TODO: add level bar
    return (
      <div style={userMenuStyle}>
        <div
          style={heartsStyle}
          onMouseEnter={this.onHeartsHover.bind(this, true)}
          onMouseLeave={this.onHeartsHover.bind(this, false)}
          onClick={this.onHeartsClick.bind(this)}
          data-tour-id={'hearts'}
        >
          <span>{commaFormatted(user.vcCurrent)}</span>
          <span
            style={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            ref={ref => {
              this.heartIconContainer = ref
            }}
          >
            <HeartBorderIcon
              style={{ marginLeft: 2, height: 24, width: 24, paddingBottom: 0 }}
              color={dashboardIconInactiveColor}
              hoverColor={dashboardIconActiveColor}
            />
            {reachedMaxDailyHearts ? (
              <CheckmarkIcon
                style={{
                  height: 16,
                  width: 16,
                  position: 'absolute',
                  paddingLeft: 4,
                  paddingBottom: 2,
                }}
                color={dashboardIconInactiveColor}
                hoverColor={dashboardIconActiveColor}
              />
            ) : null}
            {reachedMaxDailyHearts ? (
              <DashboardPopover
                open={this.state.heartsHover && !this.state.heartsPopoverOpen}
                anchorEl={this.state.heartsHoverPopoverAnchorElem}
                style={heartsPopoverStyle}
              >
                <div style={{ padding: 10 }}>
                  You've earned the maximum Hearts from opening tabs today!
                  You'll be able to earn more Hearts in a few hours.
                </div>
              </DashboardPopover>
            ) : null}
          </span>
        </div>
        <HeartsDropdown
          app={app}
          user={user}
          open={this.state.heartsPopoverOpen}
          onClose={this.handleHeartsPopoverClose.bind(this)}
          anchorElement={this.state.heartsPopoverAnchorElem}
        />
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
        <DashboardPopover
          style={menuPopoverStyle}
          open={this.state.menuOpen}
          anchorEl={this.state.menuPopoverAnchorElem}
          onRequestClose={this.handleMenuPopoverClose.bind(this)}
        >
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
                <HeartIcon
                  color={menuItemIconColor}
                  style={menuItemSvgIconStyle}
                />
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
                <ChartIcon
                  color={menuItemIconColor}
                  style={menuItemSvgIconStyle}
                />
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
                onClick={this.logout.bind(this)}
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
      </div>
    )
  }
}

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

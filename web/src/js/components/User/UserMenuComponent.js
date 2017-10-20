import React from 'react'
import PropTypes from 'prop-types'
import DashboardPopover from '../Dashboard/DashboardPopover'
import RaisedButton from 'material-ui/RaisedButton'
import Divider from 'material-ui/Divider'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import {
  goToInviteFriends,
  goToDonate,
  goToSettings,
  goToStats
} from 'navigation/navigation'
import appTheme, {
  dashboardIconActiveColor,
  dashboardIconInactiveColor,
  dividerColor
} from 'theme/default'

class UserMenu extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      heartsHover: false,
      heartsPopoverOpen: false,
      menuIconHover: false,
      menuOpen: false
    }
  }

  onHeartsHover (hovering) {
    this.setState({
      heartsHover: hovering
    })
  }

  onHeartsClick (event) {
    this.setState({
      heartsPopoverOpen: !this.state.open,
      heartsPopoverAnchorElem: event.currentTarget
    })
  }

  handleHeartsPopoverClose () {
    this.setState({
      heartsPopoverOpen: false
    })
  }

  onMenuClick (event) {
    this.setState({
      menuOpen: !this.state.open,
      menuPopoverAnchorElem: event.currentTarget
    })
  }

  handleMenuPopoverClose () {
    this.setState({
      menuOpen: false
    })
  }

  onMenuIconHover (hovering) {
    this.setState({
      menuIconHover: hovering
    })
  }

  onHover (hovering) {
    this.setState({
      hover: hovering
    })
  }

  render () {
    const { app, user } = this.props
    if (!user || !app) {
      return null
    }

    const userMenuStyle = {
      display: 'flex',
      alignItems: 'center'
    }

    // Hearts style
    const textStyle = Object.assign({}, {
      color: this.state.heartsHover
        ? dashboardIconActiveColor
        : dashboardIconInactiveColor,
      transition: 'color 300ms ease-in',
      fontSize: 18,
      fontWeight: 'normal',
      fontFamily: appTheme.fontFamily,
      userSelect: 'none',
      cursor: 'pointer'
    }, this.props.style)
    const heartsStyle = Object.assign({}, textStyle, {
      marginRight: 0
    })
    const heartIconStyle = {
      marginLeft: 3
    }

    // Hearts popover style
    const heartsPopoverStyle = {
      textAlign: 'center',
      width: 210
    }
    const heartsPopoverSectionStyle = {
    }
    const dividerStyle = {
      marginTop: 16,
      marginBottom: 12
    }
    const statTextStyle = {
      fontSize: 14,
      display: 'block',
      marginTop: 4,
      marginBottom: 4
    }
    const smallHeartIconStyle = {
      marginLeft: 2
    }
    const statNumberStyle = {
      fontSize: 24,
      display: 'block'
    }
    const popoverButtonStyle = {
      marginTop: 6,
      marginBottom: 0
    }

    // Popover section on how to earn Hearts.
    const rewardMethodContainerStyle = Object.assign({}, statTextStyle, {
      display: 'flex',
      textAlign: 'left',
      color: dividerColor,
      marginTop: 1,
      marginBottom: 1
    })
    const rewardAmountsSectionStyle = Object.assign({}, heartsPopoverSectionStyle, {
      paddingLeft: 12,
      paddingRight: 12
    })
    const rewardTextStyle = {
      textAlign: 'left',
      flex: 6
    }
    const rewardValueStyle = {
      flex: 3,
      textAlign: 'right'
    }

    // Menu style
    const menuPopoverStyle = {
      padding: 0,
      width: 'auto'
    }
    const menuIconButtonStyle = {
      padding: 0,
      width: 40,
      height: 40
    }
    const menuIconStyle = {
      color: (
        this.state.menuIconHover
        ? dashboardIconActiveColor
        : dashboardIconInactiveColor
      ),
      transition: 'color 300ms ease-in',
      fontSize: 22
    }
    const menuStyle = {
      backgroundColor: 'transparent',
      fontFamily: appTheme.fontFamily
    }
    const menuItemStyle = {
      fontSize: 14,
      color: appTheme.palette.alternateTextColor
    }

    // TODO: add level bar
    return (
      <div
        style={userMenuStyle}>
        <div
          style={heartsStyle}
          onMouseEnter={this.onHeartsHover.bind(this, true)}
          onMouseLeave={this.onHeartsHover.bind(this, false)}
          onClick={this.onHeartsClick.bind(this)}
        >
          {user.vcCurrent}<i style={heartIconStyle} className='fa fa-heart-o' />
        </div>
        <DashboardPopover
          open={this.state.heartsPopoverOpen}
          anchorEl={this.state.heartsPopoverAnchorElem}
          onRequestClose={this.handleHeartsPopoverClose.bind(this)}
          style={heartsPopoverStyle}
        >
          <div style={{ padding: 10 }}>
            <div style={heartsPopoverSectionStyle}>
              <span style={statTextStyle}><span style={statNumberStyle}>Level {user.level}</span></span>
              <div>
                <span>{user.heartsUntilNextLevel}</span>
                <i style={smallHeartIconStyle} className='fa fa-heart-o' /> until next level
              </div>
            </div>
            <Divider style={dividerStyle} />
            <div style={heartsPopoverSectionStyle}>
              <span style={statTextStyle}>
                <span style={statNumberStyle}>
                  {user.vcDonatedAllTime}<i style={smallHeartIconStyle} className='fa fa-heart-o' />
                </span> Donated
              </span>
              <div>
                <RaisedButton
                  label='Donate Hearts'
                  style={popoverButtonStyle}
                  primary
                  onClick={goToDonate}
                />
              </div>
            </div>
            <Divider style={dividerStyle} />
            <div style={heartsPopoverSectionStyle}>
              <span style={statTextStyle}>
                <span style={statNumberStyle}>{user.numUsersRecruited}</span> Tabbers Recruited
              </span>
              <div>
                <RaisedButton
                  label='Invite A Friend'
                  labelPosition='before'
                  style={popoverButtonStyle}
                  primary
                  onClick={goToInviteFriends}
               />
              </div>
            </div>
            <Divider style={dividerStyle} />
            <div style={rewardAmountsSectionStyle}>
              <span style={rewardMethodContainerStyle}>
                <span style={rewardTextStyle}>Open a tab</span>
                <span style={rewardValueStyle}>1<i style={smallHeartIconStyle} className='fa fa-heart-o' /></span>
              </span>
              <span style={rewardMethodContainerStyle}>
                <span style={rewardTextStyle}>Recruit a friend</span>
                <span style={rewardValueStyle}>{app.referralVcReward}<i style={smallHeartIconStyle} className='fa fa-heart-o' /></span>
              </span>
            </div>
          </div>
        </DashboardPopover>
        <IconButton
          style={menuIconButtonStyle}
          iconStyle={menuIconStyle}
          onMouseEnter={this.onMenuIconHover.bind(this, true)}
          onMouseLeave={this.onMenuIconHover.bind(this, false)}
          onClick={this.onMenuClick.bind(this)}
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
            style={menuStyle}
            menuItemStyle={menuItemStyle}
          >
            <MenuItem primaryText='Settings' onClick={goToSettings} />
            <MenuItem primaryText='Donate Hearts' onClick={goToDonate} />
            <MenuItem primaryText='Invite Friends' onClick={goToInviteFriends} />
            <MenuItem primaryText='Your Stats' onClick={goToStats} />
          </Menu>
        </DashboardPopover>
      </div>
    )
  }
}

UserMenu.propTypes = {
  app: PropTypes.shape({
    referralVcReward: PropTypes.number.isRequired
  }),
  user: PropTypes.shape({
    vcCurrent: PropTypes.number.isRequired,
    level: PropTypes.number.isRequired,
    heartsUntilNextLevel: PropTypes.number.isRequired,
    vcDonatedAllTime: PropTypes.number.isRequired
  }),
  style: PropTypes.object
}

UserMenu.defaultProps = {
  style: {}
}

export default UserMenu

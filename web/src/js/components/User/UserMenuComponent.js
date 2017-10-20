import React from 'react'
import PropTypes from 'prop-types'
import DashboardPopover from '../Dashboard/DashboardPopover'
import RaisedButton from 'material-ui/RaisedButton'
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
  dashboardIconInactiveColor
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
    const { user } = this.props
    if (!user) {
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
    const heartsPopoverHeaderStyle = {
      width: '100%',
      padding: 8,
      boxSizing: 'border-box',
      textTransform: 'uppercase',
      fontWeight: 'bold',
      textAlign: 'center',
      backgroundColor: appTheme.palette.primary1Color
    }

    // Menu style
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
    // TODO: functional hearts donated and tabbers recruited stats
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
        >
          <div style={heartsPopoverHeaderStyle}>
            Your Stats
          </div>
          <div style={{ padding: 10 }}>
            <p>Level {user.level}</p>
            <p>{user.heartsUntilNextLevel} Hearts until next level</p>
            <p>{user.vcDonatedAllTime} Hearts Donated</p>
            <RaisedButton
              label='Donate Hearts'
              primary
              onClick={goToDonate}
            />
            <p>{user.numUsersRecruited} Tabbers Recruited</p>
            <RaisedButton
              label='Invite Friends'
              primary
              onClick={goToInviteFriends}
            />
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
          style={{ padding: 0 }}
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

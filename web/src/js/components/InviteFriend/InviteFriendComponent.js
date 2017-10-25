import React from 'react'
import PropTypes from 'prop-types'

import InvitePopover from './InvitePopover'
import IconButton from 'material-ui/IconButton'
import FontIcon from 'material-ui/FontIcon'

import {
  dashboardIconInactiveColor,
  dashboardIconActiveColor
} from 'theme/default'

class InviteFriend extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      open: false
    }
  }

  handleClick (event) {
    this.setState({
      open: true,
      anchorEl: event.currentTarget
    })
  }

  handleInvitePopoverRequestClose () {
    this.setState({
      open: false
    })
  }

  render () {
    const { user } = this.props
    if (!user) {
      return null
    }
    const username = user ? user.username : ''

    return (
      <div>
        <IconButton
          tooltip='Invite Friend'
          tooltipPosition='top-left'
          style={this.props.style}
          iconStyle={this.props.iconStyle}
          onClick={this.handleClick.bind(this)}>
          <FontIcon
            color={dashboardIconInactiveColor}
            hoverColor={dashboardIconActiveColor}
            className='fa fa-users fa-lg' />
        </IconButton>

        <InvitePopover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          username={username}
          onRequestClose={this.handleInvitePopoverRequestClose.bind(this)} />
      </div>
    )
  }
}

InviteFriend.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired
  }),
  style: PropTypes.object,
  iconStyle: PropTypes.object
}

InviteFriend.defaultProps = {
  style: {},
  iconStyle: {}
}

export default InviteFriend

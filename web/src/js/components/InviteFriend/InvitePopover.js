import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import Popover from 'material-ui/Popover/Popover'
import Subheader from 'material-ui/Subheader'
import TextField from 'material-ui/TextField';

import appTheme from 'theme/default'

class InvitePopover extends React.Component {

  constructor(props) {
    super(props)
    this.input = null
    this.state = {
      selected: false,
    }
  }

  handleRequestClose = () => {
    this.props.onRequestClose()
  }

  getReferralUrl() {
    return 'http://tab.gladly.io/?r=' + this.props.userId
  }

  onTextFieldClicked() {
    this.input.select()
    this.setState({
      selected: !this.state.selected,
    })
  }

  render () {

    const referralUrl = this.getReferralUrl()

    const style = {
      width: 450,
      backgroundColor: 'rgba(0,0,0,.5)'
    }

    const textStyle = {
       color: appTheme.palette.alternateTextColor,
       fontFamily: appTheme.fontFamily
    }

    const header = Object.assign({}, textStyle)
    const message = Object.assign({}, textStyle, {
      padding: 16,
      paddingTop: 0,
      fontSize: 14,
    })

    const inputContainer = {
      padding: 16,
      paddingTop: 0,
    }

    const input = {
      width: '100%'
    }

    const instructions = Object.assign({}, textStyle, {
      color: appTheme.palette.primary3Color,
      borderColor: appTheme.palette.primary3Color,
    })

    return (
      <Popover
        open={this.props.open}
        anchorEl={this.props.anchorEl}
        onRequestClose={this.handleRequestClose.bind(this)}
        anchorOrigin={{horizontal: 'middle', vertical: 'top'}}
        targetOrigin={{horizontal: 'left', vertical: 'bottom'}}
        style={style}>
          <div>
            <Subheader style={header}>Increase your impact!</Subheader>
            <p style={message}>More Tabbers means more money to charity! Recruit friends and earn 350 Hearts when they start Tabbing!</p>
            <div style={inputContainer}>
              <TextField
                ref={(input) => {this.input = input}}
                id={'refer-friend-input-key'}
                onClick={this.onTextFieldClicked.bind(this)}
                style={input}
                inputStyle={textStyle}
                value={referralUrl}
                errorStyle={instructions}
                errorText={'Copy and send to your friends'}
                />
            </div>
          </div>
      </Popover>
    )
  }
}

InvitePopover.propTypes = {
  open: PropTypes.bool,
  anchorEl: PropTypes.object,
  onRequestClose: PropTypes.func,
  userId: PropTypes.string.isRequired
}

InvitePopover.defaultProps = {
  open: false,
  anchorEl: null,
  onRequestClose: () => {}
}


export default InvitePopover

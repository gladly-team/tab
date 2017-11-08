import React from 'react'
import PropTypes from 'prop-types'
import { Paper } from 'material-ui'
import TextField from 'material-ui-next/TextField'
import { withStyles } from 'material-ui-next/styles'
import { alternateAccentColor } from 'theme/default'

// Can replace this with a proper theme after fully migrating to
// material-ui 1.0.
// https://github.com/callemall/material-ui/blob/v1-beta/src/Input/Input.js#L78
const styles = theme => ({
  inputInkbar: {
    '&:after': {
      backgroundColor: alternateAccentColor
    }
  }
})

class InviteFriend extends React.Component {
  getReferralUrl () {
    return `https://tab.gladly.io/?u=${this.props.username}`
  }

  onTextFieldClicked () {
    this.input.select()
  }

  render () {
    const { classes } = this.props
    const referralUrl = this.getReferralUrl()
    const containerStyle = Object.assign({}, {
      display: 'flex',
      justifyContent: 'center',
      alignContent: 'middle',
      padding: 10,
      minWidth: 180
    }, this.props.style)

    return (
      <Paper style={containerStyle}>
        <span
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignContent: 'middle',
            width: '100%',
            maxWidth: 300,
            margin: 10,
            boxSizing: 'border-box'
          }}
        >
          <span
            style={{
              fontWeight: '600',
              marginTop: 4,
              marginBottom: 4,
              textAlign: 'center'
            }}
          >
            Share this link:
          </span>
          <TextField
            id={'refer-friend-input'}
            inputRef={(input) => { this.input = input }}
            onClick={this.onTextFieldClicked.bind(this)}
            value={referralUrl}
            InputProps={{
              classes: {
                inkbar: classes.inputInkbar
              }
            }}
            inputProps={{
              style: {
                textAlign: 'center'
              }
            }}
          />
        </span>
      </Paper>
    )
  }
}

InviteFriend.propTypes = {
  username: PropTypes.string.isRequired,
  style: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
}

InviteFriend.defaultProps = {
  style: {}
}

export default withStyles(styles)(InviteFriend)

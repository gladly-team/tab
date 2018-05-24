import React from 'react'
import PropTypes from 'prop-types'
import { Paper } from 'material-ui'
import TextField from '@material-ui/core/TextField'
import { withStyles } from '@material-ui/core/styles'
import { alternateAccentColor } from 'theme/default'

// Can replace this with a proper theme after fully migrating to
// material-ui 1.0.
// https://github.com/callemall/material-ui/blob/v1-beta/src/Input/Input.js#L78
const styles = theme => ({
  inputUnderline: {
    '&:after': {
      borderColor: alternateAccentColor
    }
  },
  formLabelRoot: {
    '&$formLabelFocused': {
      color: alternateAccentColor
    }
  },
  formLabelFocused: {}
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
            marginTop: 30,
            marginBottom: 30,
            marginLeft: 8,
            marginRight: 8,
            boxSizing: 'border-box'
          }}
        >
          <TextField
            id={'refer-friend-input'}
            inputRef={(input) => { this.input = input }}
            onClick={this.onTextFieldClicked.bind(this)}
            value={referralUrl}
            label={'Share this link'}
            helperText={"and you'll get 350 Hearts for every person who joins!"}
            InputProps={{
              classes: {
                underline: classes.inputUnderline
              }
            }}
            /* eslint-disable-next-line react/jsx-no-duplicate-props */
            inputProps={{
              style: {
                textAlign: 'left'
              }
            }}
            InputLabelProps={{
              FormLabelClasses: {
                root: classes.formLabelRoot,
                focused: classes.formLabelFocused
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

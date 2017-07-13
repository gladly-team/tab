import React from 'react'
import PropTypes from 'prop-types'
import Popover from 'material-ui/Popover/Popover'

import appTheme from 'theme/default'

class MoneyRaisedPopover extends React.Component {
  handleRequestClose () {
    this.props.onRequestClose()
  }

  render () {
    const style = {
      backgroundColor: 'rgba(0,0,0,.5)',
      marginTop: 30,
      width: 190
    }

    const textStyle = {
      color: appTheme.palette.alternateTextColor,
      fontFamily: appTheme.fontFamily,
      padding: 10,
      paddingTop: 0,
      fontSize: 14
    }

    return (
      <Popover
        open={this.props.open}
        anchorEl={this.props.anchorEl}
        onRequestClose={this.handleRequestClose.bind(this)}
        anchorOrigin={{horizontal: 'left', vertical: 'top'}}
        targetOrigin={{horizontal: 'left', vertical: 'bottom'}}
        style={style}>
        <div>
          <p style={textStyle}>This is how much money Tabbers have raised to date.</p>
          <p style={textStyle}>Keep Tabbing!</p>
        </div>
      </Popover>
    )
  }
}

MoneyRaisedPopover.propTypes = {
  open: PropTypes.bool,
  anchorEl: PropTypes.object,
  onRequestClose: PropTypes.func
}

MoneyRaisedPopover.defaultProps = {
  open: false,
  anchorEl: null,
  onRequestClose: () => {}
}

export default MoneyRaisedPopover

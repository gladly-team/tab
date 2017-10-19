import React from 'react'
import PropTypes from 'prop-types'
import Popover from 'material-ui/Popover/Popover'
import appTheme from 'theme/default'

class DashboardPopover extends React.Component {
  handleRequestClose () {
    this.props.onRequestClose()
  }

  render () {
    const style = Object.assign({}, {
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      width: 220,
      padding: 0,
      paddingTop: 0,
      fontSize: 14,
      color: appTheme.palette.alternateTextColor,
      fontFamily: appTheme.fontFamily
    }, this.props.style)

    return (
      <Popover
        open={this.props.open}
        anchorEl={this.props.anchorEl}
        onRequestClose={this.handleRequestClose.bind(this)}
        anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
        style={style}
        useLayerForClickAway={false}
      >
        {this.props.children}
      </Popover>
    )
  }
}

DashboardPopover.propTypes = {
  open: PropTypes.bool,
  anchorEl: PropTypes.object,
  onRequestClose: PropTypes.func,
  style: PropTypes.object
}

DashboardPopover.defaultProps = {
  open: false,
  anchorEl: null,
  onRequestClose: () => {},
  style: {}
}

export default DashboardPopover

import React from 'react'
import PropTypes from 'prop-types'
import Popover from '@material-ui/core/Popover'
import { withTheme } from '@material-ui/core/styles'

const DashboardPopover = props => {
  const { anchorEl, children, onClose, open, theme, ...otherProps } = props
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      {...otherProps}
    >
      <div
        style={{
          width: '100%',
          height: 3,
          // We should test that we're using this MUI theme color
          // (e.g., see them tests in MoneyRaisedComponent). Skipping
          // for now because testing portal components with Enzyme
          // appears to still be a pain:
          // https://github.com/airbnb/enzyme/issues/252#issuecomment-266125422
          // https://github.com/mui-org/material-ui/issues/14342
          backgroundColor: theme.palette.primary.main,
        }}
      />
      {children}
    </Popover>
  )
}

DashboardPopover.propTypes = {
  anchorEl: PropTypes.object,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  onClose: PropTypes.func,
  open: PropTypes.bool,
  theme: PropTypes.object.isRequired,
}

DashboardPopover.defaultProps = {
  open: false,
  anchorEl: null,
  onClose: () => {},
}

export default withTheme()(DashboardPopover)

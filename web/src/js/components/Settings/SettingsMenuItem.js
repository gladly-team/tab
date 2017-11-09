import React from 'react'
import PropTypes from 'prop-types'
import MenuItem from 'material-ui/MenuItem'
import NavLink from 'general/NavLink'

class SettingsMenuItem extends React.Component {
  render () {
    const menuItemStyle = Object.assign(
      {},
      this.props.style)
    return (
      <NavLink
        to={this.props.to}
        style={{ textDecoration: 'none' }}
      >
        <MenuItem style={menuItemStyle}>
          {this.props.children}
        </MenuItem>
      </NavLink>
    )
  }
}

SettingsMenuItem.propTypes = {
  to: PropTypes.string.isRequired,
  style: PropTypes.object
}

SettingsMenuItem.defaultProps = {
  style: {}
}

export default SettingsMenuItem

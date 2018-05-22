import React from 'react'
import PropTypes from 'prop-types'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
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
        <ListItem style={menuItemStyle}>
          <ListItemText primary={this.props.children} />
        </ListItem>
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

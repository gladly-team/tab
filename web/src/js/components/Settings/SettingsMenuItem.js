import React from 'react'
import PropTypes from 'prop-types'
import { withTheme } from '@material-ui/core/styles'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import NavLink from 'general/NavLink'

class SettingsMenuItem extends React.Component {
  render () {
    const { theme, to } = this.props
    const isActive = this.context.router.isActive(to)
    const listItemStyle = Object.assign({},
      isActive ? {
        background: theme.palette.action.hover
      } : null
    )
    return (
      <NavLink
        to={this.props.to}
        style={{ textDecoration: 'none' }}
      >
        <ListItem style={listItemStyle} button>
          <ListItemText primary={this.props.children} />
        </ListItem>
      </NavLink>
    )
  }
}

SettingsMenuItem.contextTypes = {
  router: PropTypes.object
}

SettingsMenuItem.propTypes = {
  theme: PropTypes.object.isRequired,
  to: PropTypes.string.isRequired
}
export default withTheme()(SettingsMenuItem)

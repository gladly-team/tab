import React from 'react'
import PropTypes from 'prop-types'
import { withTheme } from '@material-ui/core/styles'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { NavLink } from 'react-router-dom'

class SettingsMenuItem extends React.Component {
  render() {
    const { theme, to } = this.props
    return (
      <NavLink
        to={to}
        style={{ textDecoration: 'none', display: 'block' }}
        activeStyle={{
          background: theme.palette.action.hover,
        }}
      >
        <ListItem button>
          <ListItemText
            primary={this.props.children}
            primaryTypographyProps={{
              variant: 'body2',
            }}
          />
        </ListItem>
      </NavLink>
    )
  }
}

SettingsMenuItem.contextTypes = {
  router: PropTypes.object,
}

SettingsMenuItem.propTypes = {
  theme: PropTypes.object.isRequired,
  to: PropTypes.string.isRequired,
}
export default withTheme()(SettingsMenuItem)

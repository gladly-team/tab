import React from 'react'
import PropTypes from 'prop-types'
import { withTheme } from '@material-ui/core/styles'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { NavLink } from 'react-router-dom'

/**
 * A menu item component for the settings sidebar navigation.
 * Supports both internal routes (using NavLink) and external URLs (using anchor tag).
 */
class SettingsMenuItem extends React.Component {
  render() {
    const { theme, to, external } = this.props
    const listItemContent = (
      <ListItem button>
        <ListItemText
          primary={this.props.children}
          primaryTypographyProps={{
            variant: 'body2',
          }}
        />
      </ListItem>
    )

    if (external) {
      return (
        <a href={to} style={{ textDecoration: 'none', display: 'block' }}>
          {listItemContent}
        </a>
      )
    }

    return (
      <NavLink
        to={to}
        style={{ textDecoration: 'none', display: 'block' }}
        activeStyle={{
          background: theme.palette.action.hover,
        }}
      >
        {listItemContent}
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
  external: PropTypes.bool,
}

SettingsMenuItem.defaultProps = {
  external: false,
}

export default withTheme()(SettingsMenuItem)

import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash/object'
import { withStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import SettingsDropdown from 'js/components/Dashboard/SettingsDropdownComponent'
import { logout } from 'js/authentication/user'
import { goToLogin } from 'js/navigation/navigation'
import logger from 'js/utils/logger'

const styles = {
  settingsIcon: {
    padding: 0,
    width: 40,
    height: 40,
    fontSize: 22,
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
}

class SettingsButtonComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isHovering: false,
      isPopoverOpen: false,
    }
    this.anchorElement = null
  }

  async logout() {
    var logoutSuccess = false
    try {
      logoutSuccess = await logout()
    } catch (e) {
      logger.error(e)
    }
    if (logoutSuccess) {
      goToLogin()
    }
  }

  render() {
    const { classes, isUserAnonymous, theme } = this.props
    const { isHovering, isPopoverOpen } = this.state
    const anchorElement = this.anchorElement
    return (
      <div>
        <IconButton
          buttonRef={anchorElement => (this.anchorElement = anchorElement)}
          data-test-id={'settings-button'}
          data-tour-id={'settings-button'}
          className={classes.settingsIcon}
          onClick={() => {
            this.setState({
              isPopoverOpen: !this.state.open,
            })
          }}
          onMouseEnter={event => {
            this.setState({
              isHovering: true,
            })
          }}
          onMouseLeave={event => {
            this.setState({
              isHovering: false,
            })
          }}
        >
          <MoreVertIcon
            style={{
              color:
                isHovering || isPopoverOpen
                  ? get(
                      theme,
                      'overrides.MuiTypography.h2.&:hover.color',
                      'inherit'
                    )
                  : get(theme, 'typography.h2.color', 'inherit'),
              transition: 'color 300ms ease-in',
            }}
          />
        </IconButton>
        <SettingsDropdown
          open={isPopoverOpen}
          anchorElement={anchorElement}
          onClose={() => {
            this.setState({
              isPopoverOpen: false,
            })
          }}
          onLogoutClick={this.logout.bind(this)}
          isUserAnonymous={isUserAnonymous}
        />
      </div>
    )
  }
}

SettingsButtonComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  isUserAnonymous: PropTypes.bool.isRequired,
  theme: PropTypes.object.isRequired,
}

SettingsButtonComponent.defaultProps = {
  classes: {},
}

export default withStyles(styles, { withTheme: true })(SettingsButtonComponent)

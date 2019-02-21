import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import SettingsDropdown from 'js/components/Dashboard/SettingsDropdownComponent'
import { logout } from 'js/authentication/user'
import { goToLogin } from 'js/navigation/navigation'
import logger from 'js/utils/logger'

// TODO: break out to make the component customizable:
// https://material-ui.com/customization/overrides/#3-specific-variation-of-a-component
const fontColor = 'rgba(255, 255, 255, 0.8)'
const fontColorActive = 'white'
const styles = {
  settingsIcon: {
    color: fontColor,
    padding: 0,
    width: 40,
    height: 40,
    transition: 'color 300ms ease-in',
    fontSize: 22,
    '&:hover': {
      color: fontColorActive,
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
    const { classes, isUserAnonymous } = this.props
    const { isPopoverOpen } = this.state
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
        >
          <MoreVertIcon />
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
}

SettingsButtonComponent.defaultProps = {
  classes: {},
}

export default withStyles(styles)(SettingsButtonComponent)

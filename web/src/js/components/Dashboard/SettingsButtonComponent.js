import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash/object'
import { withStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import MoreVertIcon from '@material-ui/icons/MoreVert'

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

  render() {
    const { classes, dropdown, theme } = this.props
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
        {dropdown({
          open: isPopoverOpen,
          onClose: () => {
            this.setState({
              isPopoverOpen: false,
            })
          },
          anchorElement: anchorElement,
        })}
      </div>
    )
  }
}

SettingsButtonComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  dropdown: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
}

SettingsButtonComponent.defaultProps = {
  classes: {},
}

export default withStyles(styles, { withTheme: true })(SettingsButtonComponent)

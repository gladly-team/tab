import React from 'react'
import PropTypes from 'prop-types'

import FadeInDashboardAnimation from 'general/FadeInDashboardAnimation'

import IconButton from 'material-ui/IconButton'
import FontIcon from 'material-ui/FontIcon'

import appTheme, {
  dashboardIconInactiveColor,
  dashboardIconActiveColor
} from 'theme/default'

class WidgetMenuIcon extends React.Component {
  onWidgetIconClicked () {
    this.props.onWidgetIconClicked(
      this.props.widget)
  }

  render () {
    const style = {
      container: {
        background: 'transparent',
        padding: 0,
        borderRadius: '100%',
        margin: 5,
        width: 44,
        height: 44
      }
    }

    var activeStyle = {}
    if (this.props.active) {
      activeStyle = {
        // This styles are for using a border bottom for active icon instead of full circle.
        // border: 'none',
        // borderColor: appTheme.palette.primary1Color,
        // borderBottomWidth: 2,
        // borderBottomStyle: 'solid',
        background: appTheme.palette.primary1Color,
        boxShadow: 'rgba(0, 0, 0, 0.3) 0px 19px 60px, rgba(0, 0, 0, 0.22) 0px 15px 20px',
        transform: 'scale(1.14)',
        WebkitBoxShadow: 'rgba(0, 0, 0, 0.3) 0px 19px 60px, rgba(0, 0, 0, 0.22) 0px 15px 20px'
      }
    }

    const iconButtonStyle = Object.assign({}, style.container, activeStyle)

    const iconStyle = {
      fontSize: 22
    }
    if (this.props.active) {
      iconStyle.color = dashboardIconActiveColor
    }

    return (
      <FadeInDashboardAnimation>
        <span>
          <IconButton
            style={iconButtonStyle}
            iconStyle={iconStyle}
            key={this.props.iconClassName + 'animation-key'}
            onClick={this.onWidgetIconClicked.bind(this)}>
            <FontIcon
              color={dashboardIconInactiveColor}
              hoverColor={dashboardIconActiveColor}
              className={this.props.iconClassName} />
          </IconButton>
        </span>
      </FadeInDashboardAnimation>
    )
  }
}

WidgetMenuIcon.propTypes = {
  onWidgetIconClicked: PropTypes.func.isRequired,
  iconClassName: PropTypes.string.isRequired,
  widget: PropTypes.object.isRequired
}

export default WidgetMenuIcon

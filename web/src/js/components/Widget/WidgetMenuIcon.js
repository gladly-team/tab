import React from 'react'
import PropTypes from 'prop-types'

import FadeInAnimation from 'general/FadeInAnimation'

import IconButton from 'material-ui/IconButton'
import FontIcon from 'material-ui/FontIcon'

import {
  grey300
} from 'material-ui/styles/colors'

import appTheme from 'theme/default'

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
      }
    }

    var activeStyle = {};
    if(this.props.active) {
      activeStyle = {
        // This styles are for using a border bottom for active icon instead of full circle.
        // border: 'none',
        // borderColor: appTheme.palette.primary1Color,
        // borderBottomWidth: 2,
        // borderBottomStyle: 'solid',
        background: appTheme.palette.primary1Color,
        boxShadow: 'rgba(0, 0, 0, 0.3) 0px 19px 60px, rgba(0, 0, 0, 0.22) 0px 15px 20px',
        transform: 'scale(1.2)',
        WebkitBoxShadow: 'rgba(0, 0, 0, 0.3) 0px 19px 60px, rgba(0, 0, 0, 0.22) 0px 15px 20px',
      }
    }

    const finalIconStyle = Object.assign({}, style.container, activeStyle)

    return (
      <FadeInAnimation>
        <IconButton
          style={finalIconStyle}
          key={this.props.iconClassName + 'animation-key'}
          onClick={this.onWidgetIconClicked.bind(this)}>
          <FontIcon
            color={grey300}
            hoverColor={'#FFF'}
            className={this.props.iconClassName} />
        </IconButton>
      </FadeInAnimation>
    )
  }
}

WidgetMenuIcon.propTypes = {
  onWidgetIconClicked: PropTypes.func.isRequired,
  iconClassName: PropTypes.string.isRequired,
  widget: PropTypes.object.isRequired
}

export default WidgetMenuIcon

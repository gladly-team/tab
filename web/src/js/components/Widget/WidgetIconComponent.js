import React from 'react'
import PropTypes from 'prop-types'
import FadeInDashboardAnimation from 'general/FadeInDashboardAnimation'
import IconButton from 'material-ui/IconButton'
import BookmarkBorderIcon from 'material-ui/svg-icons/action/bookmark-border'
// import ListIcon from 'material-ui/svg-icons/action/list'
import FormatListBulletedIcon from 'material-ui/svg-icons/editor/format-list-bulleted'
// import NoteIcon from 'material-ui/svg-icons/av/note'
import EditIcon from 'material-ui/svg-icons/editor/mode-edit'
import SearchIcon from 'material-ui/svg-icons/action/search'
import appTheme, {
  dashboardIconInactiveColor,
  dashboardIconActiveColor
} from 'theme/default'
import {
  WIDGET_TYPE_BOOKMARKS,
  WIDGET_TYPE_NOTES,
  WIDGET_TYPE_SEARCH,
  WIDGET_TYPE_TODOS
} from '../../constants'

class WidgetIcon extends React.Component {
  onWidgetIconClicked () {
    this.props.onWidgetIconClicked(this.props.widget)
  }

  render () {
    const { widget } = this.props

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
        background: appTheme.palette.primary1Color,
        boxShadow: 'rgba(0, 0, 0, 0.3) 0px 19px 60px, rgba(0, 0, 0, 0.22) 0px 15px 20px',
        transform: 'scale(1.14)',
        WebkitBoxShadow: 'rgba(0, 0, 0, 0.3) 0px 19px 60px, rgba(0, 0, 0, 0.22) 0px 15px 20px'
      }
    }
    const iconButtonStyle = Object.assign({}, style.container, activeStyle)
    const iconColor = (
      this.props.active
      ? dashboardIconActiveColor
      : dashboardIconInactiveColor
    )
    const iconHoverColor = dashboardIconActiveColor

    var icon
    switch (widget.type) {
      case WIDGET_TYPE_BOOKMARKS:
        icon = (
          <BookmarkBorderIcon
            color={iconColor}
            hoverColor={iconHoverColor}
          />
        )
        break

      case WIDGET_TYPE_NOTES:
        icon = (
          <EditIcon
            color={iconColor}
            hoverColor={iconHoverColor}
          />
        )
        break

      case WIDGET_TYPE_SEARCH:
        icon = (
          <SearchIcon
            color={iconColor}
            hoverColor={iconHoverColor}
          />
        )
        break

      case WIDGET_TYPE_TODOS:
        icon = (
          <FormatListBulletedIcon
            color={iconColor}
            hoverColor={iconHoverColor}
          />
        )
        break

      default:
        icon = null
    }

    if (!icon) {
      return null
    }

    // Note: extra span wrapper needed for fade animation to
    // work properly.
    return (
      <span>
        <IconButton
          style={iconButtonStyle}
          key={this.props.widget.type + 'animation-key'}
          onClick={this.onWidgetIconClicked.bind(this)}
        >
          {icon}
        </IconButton>
      </span>
    )
  }
}

WidgetIcon.propTypes = {
  widget: PropTypes.object.isRequired,
  onWidgetIconClicked: PropTypes.func.isRequired,
  active: PropTypes.bool
}

WidgetIcon.defaultProps = {
  active: false
}

export default WidgetIcon

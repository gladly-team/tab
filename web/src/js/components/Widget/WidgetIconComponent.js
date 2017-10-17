import React from 'react'
import PropTypes from 'prop-types'

import {
  WIDGET_TYPE_BOOKMARKS,
  WIDGET_TYPE_NOTES,
  WIDGET_TYPE_TODOS
} from '../../constants'

import WidgetMenuIcon from './WidgetMenuIcon'

class WidgetIcon extends React.Component {
  onWidgetIconClicked (widget) {
    this.props.onWidgetIconClicked(widget)
  }

  render () {
    const { widget } = this.props

    switch (widget.type) {
      case WIDGET_TYPE_BOOKMARKS:
        return (<WidgetMenuIcon
          widget={widget}
          active={this.props.active}
          onWidgetIconClicked={this.onWidgetIconClicked.bind(this)}
          iconClassName={'fa fa-bookmark-o'} />)

      case WIDGET_TYPE_NOTES:
        return (<WidgetMenuIcon
          widget={widget}
          active={this.props.active}
          onWidgetIconClicked={this.onWidgetIconClicked.bind(this)}
          iconClassName={'fa fa-sticky-note-o'} />)

      case WIDGET_TYPE_TODOS:
        return (<WidgetMenuIcon
          widget={widget}
          active={this.props.active}
          onWidgetIconClicked={this.onWidgetIconClicked.bind(this)}
          iconClassName={'fa fa-list-ul'} />)
      default:
        return null
    }
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

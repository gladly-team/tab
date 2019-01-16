import React from 'react'
import PropTypes from 'prop-types'

import {
  WIDGET_TYPE_BOOKMARKS,
  WIDGET_TYPE_CLOCK,
  WIDGET_TYPE_NOTES,
  WIDGET_TYPE_SEARCH,
  WIDGET_TYPE_TODOS,
} from 'js/constants'

import BookmarksWidget from 'js/components/Widget/Widgets/Bookmarks/BookmarksWidgetContainer'
import SearchWidget from 'js/components/Widget/Widgets/Search/SearchWidgetContainer'
import ClockWidget from 'js/components/Widget/Widgets/Clock/ClockWidgetContainer'
import NotesWidget from 'js/components/Widget/Widgets/Notes/NotesWidgetContainer'
import TodosWidget from 'js/components/Widget/Widgets/Todos/TodosWidgetContainer'

class Widget extends React.Component {
  render() {
    const { widget, user } = this.props

    switch (widget.type) {
      case WIDGET_TYPE_BOOKMARKS:
        return (
          <BookmarksWidget
            widget={widget}
            user={user}
            showError={this.props.showError}
          />
        )

      case WIDGET_TYPE_SEARCH:
        return <SearchWidget widget={widget} user={user} />

      case WIDGET_TYPE_CLOCK:
        return <ClockWidget widget={widget} user={user} />

      case WIDGET_TYPE_NOTES:
        return (
          <NotesWidget
            widget={widget}
            user={user}
            showError={this.props.showError}
          />
        )

      case WIDGET_TYPE_TODOS:
        return (
          <TodosWidget
            widget={widget}
            user={user}
            showError={this.props.showError}
          />
        )
      default:
        return null
    }
  }
}

Widget.propTypes = {
  widget: PropTypes.shape({
    type: PropTypes.string.isRequired,
  }).isRequired,
  user: PropTypes.object.isRequired,
  showError: PropTypes.func.isRequired,
}

export default Widget

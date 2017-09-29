import React from 'react'
import PropTypes from 'prop-types'

// Widget Types.
import BookmarksWidget from './Widgets/Bookmarks/BookmarksWidgetContainer'
import SearchWidget from './Widgets/Search/SearchWidgetContainer'
import ClockWidget from './Widgets/Clock/ClockWidgetContainer'
import NotesWidget from './Widgets/Notes/NotesWidgetContainer'
import TodosWidget from './Widgets/Todos/TodosWidgetContainer'

class Widget extends React.Component {
  render () {
    const { widget, user } = this.props

    switch (widget.type) {
      case 'bookmarks':
        return (<BookmarksWidget
          widget={widget}
          user={user}
          showError={this.props.showError} />)
      case 'search':
        return (<SearchWidget
          widget={widget}
          user={user} />)

      case 'clock':
        return (<ClockWidget
          widget={widget}
          user={user} />)

      case 'notes':
        return (<NotesWidget
          widget={widget}
          user={user}
          showError={this.props.showError} />)

      case 'todos':
        return (<TodosWidget
          widget={widget}
          user={user}
          showError={this.props.showError} />)
      default:
        return null
    }
  }
}

Widget.propTypes = {
  widget: PropTypes.shape({
    type: PropTypes.string.isRequired
  }).isRequired,
  user: PropTypes.object.isRequired,
  showError: PropTypes.func.isRequired
}

export default Widget

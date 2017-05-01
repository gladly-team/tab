import React from 'react';

// Widget Types.
import BookmarksWidget from './Widgets/Bookmarks/BookmarksWidgetContainer';
import SearchWidget from './Widgets/Search/SearchWidgetContainer';
import ClockWidget from './Widgets/Clock/ClockWidgetContainer';
import NotesWidget from './Widgets/Notes/NotesWidgetContainer';
import TodosWidget from './Widgets/Todos/TodosWidgetContainer';

class Widget extends React.Component {
  
  render() {
    const { widget, user } = this.props; 

    switch(widget.type) {
      case 'bookmarks':
        return (<BookmarksWidget 
                  widget={widget}
                  user={user}/>)
      case 'search':
        return (<SearchWidget 
                  widget={widget}
                  user={user}/>)

      case 'clock':
        return (<ClockWidget 
                  widget={widget}
                  user={user}/>)

      case 'notes':
        return (<NotesWidget 
                  widget={widget}
                  user={user}/>)

      case 'todos':
        return (<TodosWidget 
                  widget={widget}
                  user={user}/>)
      default:
        return null;
    }
  }
}

Widget.propTypes = {
  widget: React.PropTypes.object.isRequired,
  user: React.PropTypes.object.isRequired,
};

export default Widget;

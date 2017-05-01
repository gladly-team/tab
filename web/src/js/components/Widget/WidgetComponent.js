import React from 'react';

import UpdateWidgetVisibilityMutation from 'mutations/UpdateWidgetVisibilityMutation';

// Widget Types.
import BookmarksWidget from './Widgets/Bookmarks/BookmarksWidgetContainer';
import SearchWidget from './Widgets/Search/SearchWidgetContainer';
import ClockWidget from './Widgets/Clock/ClockWidgetContainer';
import NotesWidget from './Widgets/Notes/NotesWidgetContainer';
import TodosWidget from './Widgets/Todos/TodosWidgetContainer';

class Widget extends React.Component {

  popoverWidgetVisibilityChanged(user, widget, visible) {
    UpdateWidgetVisibilityMutation.commit(
      this.props.relay.environment,
      user,
      widget,
      visible
    );
  }
  
  render() {
    const { widget, user } = this.props; 

    switch(widget.type) {
      case 'bookmarks':
        return (<BookmarksWidget 
                  widget={widget}
                  user={user}
                  popoverWidgetVisibilityChanged={this.popoverWidgetVisibilityChanged.bind(this)}/>)
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
                  user={user}
                  popoverWidgetVisibilityChanged={this.popoverWidgetVisibilityChanged.bind(this)}/>)

      case 'todos':
        return (<TodosWidget 
                  widget={widget}
                  user={user}
                  popoverWidgetVisibilityChanged={this.popoverWidgetVisibilityChanged.bind(this)}/>)
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

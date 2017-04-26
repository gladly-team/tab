import React from 'react';

// Widget Types.
import BookmarksWidget from './Widgets/Bookmarks/BookmarksWidgetContainer';

class Widget extends React.Component {
  
  render() {
    const { widget, user } = this.props; 

    switch(widget.type) {
      case 'bookmarks':
        return (<BookmarksWidget 
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

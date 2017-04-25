import React from 'react';

// Widget Types.
import BookmarksWidget from './BookmarksWidget';

class Widget extends React.Component {
  
  render() {
    const { widget } = this.props; 

    switch(widget.type) {
      case 'bookmarks':
        return (<BookmarksWidget widget={widget}/>)
      default:
        return null;
    }
  }
}

Widget.propTypes = {
  widget: React.PropTypes.object.isRequired
};

export default Widget;

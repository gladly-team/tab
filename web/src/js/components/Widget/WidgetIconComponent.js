import React from 'react';
import PropTypes from 'prop-types';

// Widget Types.
import WidgetMenuIcon from './WidgetMenuIcon';

class WidgetIcon extends React.Component {

  onWidgetIconClicked(widget) {
      this.props.onWidgetIconClicked(widget);
  }

  render() {
    const { widget } = this.props; 

    switch(widget.type) {
      case 'bookmarks':
        return (<WidgetMenuIcon 
                  widget={widget}
                  onWidgetIconClicked={this.onWidgetIconClicked.bind(this)}
                  iconClassName={'fa fa-bookmark-o'}/>)

      case 'notes':
        return (<WidgetMenuIcon 
                  widget={widget}
                  onWidgetIconClicked={this.onWidgetIconClicked.bind(this)}
                  iconClassName={'fa fa-sticky-note-o'}/>)

      case 'todos':
        return (<WidgetMenuIcon 
                  widget={widget}
                  onWidgetIconClicked={this.onWidgetIconClicked.bind(this)}
                  iconClassName={'fa fa-list-ul'}/>)
      default:
        return null;
    }
  }
}

WidgetIcon.propTypes = {
  widget: PropTypes.object.isRequired,
  onWidgetIconClicked: PropTypes.func.isRequired,
};

export default WidgetIcon;

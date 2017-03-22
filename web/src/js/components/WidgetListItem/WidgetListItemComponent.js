import React from 'react';

import { ListItem } from 'material-ui/List';
import ContentInbox from 'material-ui/svg-icons/content/inbox';

class WidgetListItem extends React.Component {

  static propTypes = {
    viewer: React.PropTypes.object.isRequired,
  };

  render() {
    const { name } = this.props.widget;

    return (
       <ListItem
          primaryText={name} 
          leftIcon={<ContentInbox />}/>
    );
  }
}

export default WidgetListItem;
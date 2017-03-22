import React from 'react';

import { List, ListItem } from 'material-ui/List';
import ContentInbox from 'material-ui/svg-icons/content/inbox';
import WidgetListItem from '../WidgetListItem/WidgetListItemComponent';

class Widgets extends React.Component {

  static propTypes = {
    viewer: React.PropTypes.object.isRequired,
  };

  render() {
    const { viewer } = this.props;
    // if(!viewer.widgets)
    //   return null;
    console.log('Rendering...');

    return (
      <div>
        <h1>Widgets Store</h1>
        <List>
          <ul>
            {viewer.widgets.edges.map(({ node }) =>
              <ListItem
                key={node.id}
                primaryText={node.name}
                leftIcon={<ContentInbox />}/>
            )}
          </ul>
        </List>
      </div>
    );
  }
}

export default Widgets;
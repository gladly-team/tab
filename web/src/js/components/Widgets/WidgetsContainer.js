import Relay from 'react-relay';
import Widgets from './WidgetsComponent';
// import WidgetListItem from '../WidgetListItem/WidgetListItemContainer';

export default Relay.createContainer(Widgets, {
  initialVariables: {
    limit: 10,
  },
  
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        widgets(first:$limit) {
          edges {
            node {
              id
              name
            },
          },
        },
      }
    `,
  },
});

// ${WidgetListItem.getFragment('widget')}
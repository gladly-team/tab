import Relay from 'react-relay';
import WidgetListItem from './WidgetListItemComponent';

export default Relay.createContainer(WidgetListItem, {
  initialVariables: {
    limit: 10,
  },
  
  fragments: {
    widget: () => Relay.QL`
      fragment on Widget {
        name
      }
    `,
  },
});
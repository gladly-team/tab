import {
  createFragmentContainer,
  graphql,
} from 'react-relay/compat';

import Widgets from './WidgetsComponent';

export default createFragmentContainer(Widgets, {
  user: graphql`
    fragment WidgetsContainer_user on User {
      widgets(first: 20) {
        edges {
          node {
            id
            name
            enabled
            data
            icon
            type
          }
        }
      }
    }
  `
});

import {
  createFragmentContainer,
  graphql
} from 'react-relay'

import Widgets from 'js/components/Widget/WidgetsComponent'

export default createFragmentContainer(Widgets, {
  user: graphql`
    fragment WidgetsContainer_user on User {
      id
      activeWidget
      ...WidgetContainer_user
      widgets(first: 20 enabled:true) {
        edges {
          node {
            id
            type
            ...WidgetContainer_widget
            ...WidgetIconContainer_widget
          }
        }
      }
    }
  `
})

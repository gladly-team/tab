import {
  createFragmentContainer,
  graphql
} from 'react-relay/compat'

import BookmarksWidget from './BookmarksWidgetComponent'

export default createFragmentContainer(BookmarksWidget, {
  widget: graphql`
    fragment BookmarksWidgetContainer_widget on Widget {
      id
      name
      enabled
      visible
      data
      icon
      type
    }
  `,
  user: graphql`
    fragment BookmarksWidgetContainer_user on User {
      id
    }
  `
})

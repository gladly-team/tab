import {
  createFragmentContainer,
  graphql
} from 'react-relay'

import BookmarksWidget from 'js/components/Widget/Widgets/Bookmarks/BookmarksWidgetComponent'

export default createFragmentContainer(BookmarksWidget, {
  widget: graphql`
    fragment BookmarksWidgetContainer_widget on Widget {
      id
      name
      enabled
      visible
      data
      type
    }
  `,
  user: graphql`
    fragment BookmarksWidgetContainer_user on User {
      id
    }
  `
})

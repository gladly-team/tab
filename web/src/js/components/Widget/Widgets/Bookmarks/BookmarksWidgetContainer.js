import {
  createFragmentContainer,
  graphql
} from 'react-relay'

import BookmarksWidget from './BookmarksWidgetComponent'

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

import graphql from 'babel-plugin-relay/macro'
import {
  createFragmentContainer
} from 'react-relay'

import NotesWidget from 'js/components/Widget/Widgets/Notes/NotesWidgetComponent'

export default createFragmentContainer(NotesWidget, {
  widget: graphql`
    fragment NotesWidgetContainer_widget on Widget {
      id
      name
      enabled
      visible
      data
      type
    }
  `,
  user: graphql`
    fragment NotesWidgetContainer_user on User {
      id
    }
  `
})

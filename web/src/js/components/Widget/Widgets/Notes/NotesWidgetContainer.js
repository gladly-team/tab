import {
  createFragmentContainer,
  graphql,
} from 'react-relay/compat';

import NotesWidget from './NotesWidgetComponent';

export default createFragmentContainer(NotesWidget, {
  widget: graphql`
    fragment NotesWidgetContainer_widget on Widget {
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
    fragment NotesWidgetContainer_user on User {
      id
    }
  `
});
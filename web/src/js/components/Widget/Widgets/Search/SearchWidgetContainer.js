import {
  createFragmentContainer,
  graphql,
} from 'react-relay/compat';

import SearchWidget from './SearchWidgetComponent';

export default createFragmentContainer(SearchWidget, {
  widget: graphql`
    fragment SearchWidgetContainer_widget on Widget {
      id
      name
      enabled
      data
      icon
      type
    }
  `,
  user: graphql`
    fragment SearchWidgetContainer_user on User {
      id
    }
  `
});
import {
  createFragmentContainer,
  graphql,
} from 'react-relay/compat';

import Widget from './WidgetComponent';

export default createFragmentContainer(Widget, {
  widget: graphql`
    fragment WidgetContainer_widget on Widget {
      type
      ...BookmarksWidgetContainer_widget
      ...SearchWidgetContainer_widget
      ...ClockWidgetContainer_widget
    }
  `,
  user: graphql`
    fragment WidgetContainer_user on User {
      ...BookmarksWidgetContainer_user
      ...SearchWidgetContainer_user
      ...ClockWidgetContainer_user
    }
  `
});

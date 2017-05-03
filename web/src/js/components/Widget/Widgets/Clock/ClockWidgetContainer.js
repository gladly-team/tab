import {
  createFragmentContainer,
  graphql,
} from 'react-relay/compat';

import ClockWidget from './ClockWidgetComponent';

export default createFragmentContainer(ClockWidget, {
  widget: graphql`
    fragment ClockWidgetContainer_widget on Widget {
      id
      name
      enabled
      config
      icon
      type
    }
  `,
  user: graphql`
    fragment ClockWidgetContainer_user on User {
      id
    }
  `
});
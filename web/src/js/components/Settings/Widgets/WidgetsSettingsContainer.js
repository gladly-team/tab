import {
  createFragmentContainer,
  graphql,
} from 'react-relay/compat';

import WidgetsSettings from './WidgetsSettingsComponent';

export default createFragmentContainer(WidgetsSettings, {
  user: graphql`
    fragment WidgetsSettingsContainer_user on User {
      ...WidgetSettingsContainer_user
      widgets(first: 20) {
        edges {
          node {
            ...WidgetSettingsContainer_widget
          }
        }
      }
    }
  `
});

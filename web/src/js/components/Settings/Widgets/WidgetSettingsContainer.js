import {
  createFragmentContainer,
  graphql,
} from 'react-relay/compat';

import WidgetSettings from './WidgetSettingsComponent';

export default createFragmentContainer(WidgetSettings, {
  widget: graphql`
    fragment WidgetSettingsContainer_widget on Widget {
      id
      name
      enabled
      config
      settings
    }
  `,
  user: graphql`
    fragment WidgetSettingsContainer_user on User {
      id
    }
  `,
  appWidget: graphql`
    fragment WidgetSettingsContainer_appWidget on Widget {
      id
      icon
      name
      type
      settings
    }
  `
});
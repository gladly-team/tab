import graphql from 'babel-plugin-relay/macro'
import {
  createFragmentContainer
} from 'react-relay'

import WidgetSettings from 'js/components/Settings/Widgets/WidgetSettingsComponent'

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
      name
      type
      settings
    }
  `
})

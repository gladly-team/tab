import {
  createFragmentContainer,
  graphql
} from 'react-relay'

import WidgetsSettings from 'js/components/Settings/Widgets/WidgetsSettingsComponent'

export default createFragmentContainer(WidgetsSettings, {
  user: graphql`
    fragment WidgetsSettingsContainer_user on User {
      ...WidgetSettingsContainer_user
      widgets(first: 20) {
        edges {
          node {
            id
            name
            ...WidgetSettingsContainer_widget
          }
        }
      }
    }
  `,
  app: graphql`
    fragment WidgetsSettingsContainer_app on App {
      widgets(first: 20) {
        edges {
          node {
            id
            name
            ...WidgetSettingsContainer_appWidget
          }
        }
      }
    }
  `
})

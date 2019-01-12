import graphql from 'babel-plugin-relay/macro'
import {
  createFragmentContainer
} from 'react-relay'

import ClockWidget from 'js/components/Widget/Widgets/Clock/ClockWidgetComponent'

export default createFragmentContainer(ClockWidget, {
  widget: graphql`
    fragment ClockWidgetContainer_widget on Widget {
      id
      name
      enabled
      config
      settings
      type
    }
  `,
  user: graphql`
    fragment ClockWidgetContainer_user on User {
      id
    }
  `
})

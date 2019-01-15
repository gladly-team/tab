import graphql from 'babel-plugin-relay/macro'
import { createFragmentContainer } from 'react-relay'

import SearchWidget from 'js/components/Widget/Widgets/Search/SearchWidgetComponent'

export default createFragmentContainer(SearchWidget, {
  widget: graphql`
    fragment SearchWidgetContainer_widget on Widget {
      id
      name
      enabled
      data
      config
      settings
      type
    }
  `,
  user: graphql`
    fragment SearchWidgetContainer_user on User {
      id
    }
  `,
})

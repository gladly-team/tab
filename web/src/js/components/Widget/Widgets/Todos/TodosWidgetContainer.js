import graphql from 'babel-plugin-relay/macro'
import { createFragmentContainer } from 'react-relay'

import TodosWidget from 'js/components/Widget/Widgets/Todos/TodosWidgetComponent'

export default createFragmentContainer(TodosWidget, {
  widget: graphql`
    fragment TodosWidgetContainer_widget on Widget {
      id
      name
      enabled
      visible
      data
      type
    }
  `,
  user: graphql`
    fragment TodosWidgetContainer_user on User {
      id
    }
  `,
})

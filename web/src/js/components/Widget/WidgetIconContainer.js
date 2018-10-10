import {
  createFragmentContainer,
  graphql
} from 'react-relay'

import WidgetIcon from 'js/components/Widget/WidgetIconComponent'

export default createFragmentContainer(WidgetIcon, {
  widget: graphql`
    fragment WidgetIconContainer_widget on Widget {
      id
      type
      visible
    }
  `
})

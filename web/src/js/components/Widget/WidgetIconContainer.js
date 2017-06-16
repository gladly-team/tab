import {
  createFragmentContainer,
  graphql,
} from 'react-relay/compat';

import WidgetIcon from './WidgetIconComponent';

export default createFragmentContainer(WidgetIcon, {
  widget: graphql`
    fragment WidgetIconContainer_widget on Widget {
   	  id
      type
      visible
    }
  `
});

import {
  createFragmentContainer,
  graphql
} from 'react-relay'

import LogTab from 'js/components/Dashboard/LogTabComponent'

export default createFragmentContainer(LogTab, {
  user: graphql`
    fragment LogTabContainer_user on User {
      id
    }
  `
})

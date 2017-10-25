import {
  createFragmentContainer,
  graphql
} from 'react-relay/compat'

import LogTab from './LogTabComponent'

export default createFragmentContainer(LogTab, {
  user: graphql`
    fragment LogTabContainer_user on User {
      id
    }
  `
})

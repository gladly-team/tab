import {
  createFragmentContainer,
  graphql
} from 'react-relay/compat'

import VcUser from './VcUserComponent'

export default createFragmentContainer(VcUser, {
  user: graphql`
    fragment VcUserContainer_user on User {
      id
      vcCurrent
      vcAllTime
      level
      heartsUntilNextLevel 
    }
  `
})

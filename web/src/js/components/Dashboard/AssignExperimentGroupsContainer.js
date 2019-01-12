import graphql from 'babel-plugin-relay/macro'
import {
  createFragmentContainer
} from 'react-relay'

import AssignExperimentGroups from 'js/components/Dashboard/AssignExperimentGroupsComponent'

export default createFragmentContainer(AssignExperimentGroups, {
  user: graphql`
    fragment AssignExperimentGroupsContainer_user on User {
      id
      joined
    }
  `
})

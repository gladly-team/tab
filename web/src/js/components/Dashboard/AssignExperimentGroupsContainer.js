import {
  createFragmentContainer,
  graphql
} from 'react-relay'

import AssignExperimentGroups from 'js/components/Dashboard/AssignExperimentGroupsComponent'

export default createFragmentContainer(AssignExperimentGroups, {
  user: graphql`
    fragment AssignExperimentGroupsContainer_user on User {
      joined
    }
  `
})

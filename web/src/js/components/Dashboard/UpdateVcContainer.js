import {
  createFragmentContainer,
  graphql
} from 'react-relay/compat'

import UpdateVc from './UpdateVcComponent'

export default createFragmentContainer(UpdateVc, {
  user: graphql`
    fragment UpdateVcContainer_user on User {
      id
    }
  `
})

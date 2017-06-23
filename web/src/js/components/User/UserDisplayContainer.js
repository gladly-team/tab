import {
  createFragmentContainer,
  graphql
} from 'react-relay/compat'

import UserDisplay from './UserDisplayComponent'

export default createFragmentContainer(UserDisplay, {
  user: graphql`
    fragment UserDisplayContainer_user on User {
       id
       username
       email
    }
  `
})

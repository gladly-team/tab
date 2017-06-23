import {
  createFragmentContainer,
  graphql
} from 'react-relay/compat'

import UserBackgroundImage from './UserBackgroundImageComponent'

export default createFragmentContainer(UserBackgroundImage, {
  user: graphql`
    fragment UserBackgroundImageContainer_user on User {
      backgroundOption
      customImage
      backgroundColor
      backgroundImage {
        id
        name
        url
      }
    }
  `
})

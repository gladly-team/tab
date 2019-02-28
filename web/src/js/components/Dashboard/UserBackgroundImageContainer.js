import graphql from 'babel-plugin-relay/macro'
import { createFragmentContainer } from 'react-relay'

import UserBackgroundImage from 'js/components/Dashboard/UserBackgroundImageComponent'

export default createFragmentContainer(UserBackgroundImage, {
  user: graphql`
    fragment UserBackgroundImageContainer_user on User {
      id
      backgroundOption
      customImage
      backgroundColor
      backgroundImage {
        imageURL
        timestamp
      }
    }
  `,
})

import graphql from 'babel-plugin-relay/macro'
import {
  createFragmentContainer
} from 'react-relay'

import BackgroundImagePicker from 'js/components/Background/BackgroundImagePickerComponent'

export default createFragmentContainer(BackgroundImagePicker, {
  user: graphql`
    fragment BackgroundImagePickerContainer_user on User {
      backgroundImage {
        id
        imageURL
      }
    }
  `,
  app: graphql`
    fragment BackgroundImagePickerContainer_app on App {
      backgroundImages(first: 50) {
        edges {
          node {
            id
            name
            imageURL
            thumbnailURL
          }
        }
      }
    }
  `
})

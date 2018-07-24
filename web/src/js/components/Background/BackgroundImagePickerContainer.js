import {
  createFragmentContainer,
  graphql
} from 'react-relay/compat'

import BackgroundImagePicker from './BackgroundImagePickerComponent'

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

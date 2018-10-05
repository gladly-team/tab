import {
  createFragmentContainer,
  graphql
} from 'react-relay'

import BackgroundCustomImagePicker from './BackgroundCustomImagePickerComponent'

export default createFragmentContainer(BackgroundCustomImagePicker, {
  user: graphql`
    fragment BackgroundCustomImagePickerContainer_user on User {
      customImage
    }
  `
})

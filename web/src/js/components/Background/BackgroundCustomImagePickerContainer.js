import graphql from 'babel-plugin-relay/macro'
import {
  createFragmentContainer
} from 'react-relay'

import BackgroundCustomImagePicker from 'js/components/Background/BackgroundCustomImagePickerComponent'

export default createFragmentContainer(BackgroundCustomImagePicker, {
  user: graphql`
    fragment BackgroundCustomImagePickerContainer_user on User {
      customImage
    }
  `
})

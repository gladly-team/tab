import graphql from 'babel-plugin-relay/macro'
import {
  createFragmentContainer
} from 'react-relay'

import BackgroundSettings from 'js/components/Settings/Background/BackgroundSettingsComponent'

export default createFragmentContainer(BackgroundSettings, {
  user: graphql`
    fragment BackgroundSettingsContainer_user on User {
      id
      backgroundOption
      customImage
      backgroundColor
      backgroundImage {
        imageURL
      }
      ...BackgroundImagePickerContainer_user
      ...BackgroundColorPickerContainer_user
      ...BackgroundCustomImagePickerContainer_user
    }
  `,
  app: graphql`
    fragment BackgroundSettingsContainer_app on App {
      ...BackgroundImagePickerContainer_app
    }
  `
})

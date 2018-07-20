import {
  createFragmentContainer,
  graphql
} from 'react-relay/compat'

import BackgroundSettings from './BackgroundSettingsComponent'

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
      ...BackgroundDailyImageContainer_user
    }
  `,
  app: graphql`
    fragment BackgroundSettingsContainer_app on App {
      ...BackgroundImagePickerContainer_app
    }
  `
})
